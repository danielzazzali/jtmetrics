import { getFiles } from '../files/fileReader.js'
import { MESSAGES, METRICS_PATH, REGEX_METRICS_ID } from '../constants/constants.js'
import path from 'path'
import { logger } from '../logger/logger.js'
import { pathToFileURL } from 'url'

/**
 * Loads metric files from default and/or custom paths.
 *
 * @param {boolean} useDefaultMetrics - Whether to include metrics from the default metrics directory.
 * @param {string} __dirname - Directory of the current module.
 * @param {string} [customMetricsPath] - Optional path to additional custom metrics.
 * @returns {Promise<import('../types.js').FileEntry[]>}
 * List of metric file objects with absolute paths and names.
 *
 * @throws Will throw an error if no metrics are provided and `useDefaultMetrics` is false.
 *
 * @example
 * const files = await loadMetricFiles(true, __dirname, '/project/customMetrics');
 */
async function loadMetricFiles (useDefaultMetrics, __dirname, customMetricsPath) {
  let metricFiles = []

  if (!useDefaultMetrics && !customMetricsPath) {
    throw new Error(
      `${MESSAGES.ERRORS.NO_METRICS_TO_LOAD}: useDefaultMetrics:${useDefaultMetrics}, customMetricsPath:${customMetricsPath}`
    )
  }

  if (useDefaultMetrics) {
    const defaultPath = path.resolve(__dirname, METRICS_PATH)
    metricFiles = await getFiles(defaultPath)
  }

  if (customMetricsPath) {
    const customPath = path.resolve(customMetricsPath)
    const additionalMetricFiles = await getFiles(customPath)
    metricFiles = metricFiles.concat(additionalMetricFiles)
  }

  return metricFiles
}

/**
 * Imports a metric file and validates its structure.
 *
 * @param {{filePath: string}} file - Metric file object.
 * @returns {Promise<import('../types.js').MetricObject>}
 * Metric object containing state, visitors, and optional postProcessing function.
 *
 * @throws Will throw an error if the file lacks required exports or has an invalid/missing `state.id`.
 *
 * @example
 * const metric = await importMetric({ filePath: '/project/metrics/metric1.js' });
 */
async function importMetric (file) {
  const fileUrl = pathToFileURL(path.resolve(file.filePath)).href
  const { state, visitors, postProcessing } = await import(fileUrl)

  if (!state || !visitors) {
    throw new Error(
      `${MESSAGES.ERRORS.PROCESSING_ERROR} ${file.filePath}: ${MESSAGES.ERRORS.MISSING_EXPORTS}`
    )
  }

  if (!state.id) {
    throw new Error(
      `${MESSAGES.ERRORS.METRIC_HAS_NO_ID} ${JSON.stringify(state)}`
    )
  }

  if (!REGEX_METRICS_ID.test(state.id)) {
    throw new Error(
      `${MESSAGES.ERRORS.ERROR_INVALID_METRIC_ID} ${state.id}: ${MESSAGES.ERRORS.ID_MUST_MATCH_REGEX} ${REGEX_METRICS_ID}`
    )
  }

  return { state, visitors, postProcessing }
}

/**
 * Loads and validates metric objects from a list of metric files.
 *
 * @param {import('../types.js').FileEntry[]} metricFiles - Metric file objects to import.
 * @returns {Promise<import('../types.js').MetricObject[]>}
 * Array of validated metric objects.
 */
async function loadMetricObjects (metricFiles) {
  const metricsObjects = []

  for (const file of metricFiles) {
    try {
      const metric = await importMetric(file)
      metricsObjects.push(metric)
    } catch (error) {
      logger.logMetricError(
        `${MESSAGES.ERRORS.ERROR_IMPORTING_METRIC_FILE} ${file.filePath} ${error.message}`
      )
    }
  }

  return metricsObjects
}

export { loadMetricObjects, loadMetricFiles }
