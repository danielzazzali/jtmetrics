import { getFiles } from './files/fileReader.js'
import { constructASTs } from './ast/astProcessor.js'
import { executeMetrics } from './ast/executeMetrics.js'
import { MESSAGES } from './constants/constants.js'
import { loadMetricFiles, loadMetricObjects } from './loader/metricsLoader.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Calculates metrics for a given code path using default and/or custom metrics.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.codePath - Absolute path to the target code directory
 * @param {string} [options.customMetricsPath] - Path to additional custom metrics
 * @param {boolean} [options.useDefaultMetrics=true] - Whether to include default metrics
 * @param {boolean} [options.useBuiltinMetrics] - DEPRECATED: Alias for `useDefaultMetrics`.
 * @param {string} [options.metricsIgnoreFilePath] - Path to a `.metricsignore` file
 * @returns {Promise<Object>} - Final result object containing metrics and error logs
 *
 * @throws Will throw an error if:
 *   - `useDefaultMetrics` is false and no `customMetricsPath` is provided
 *   - `codePath` is not an absolute path
 *
 * @example
 * const results = await calculateMetrics({
 *   codePath: '/project/src',
 *   customMetricsPath: '/project/customMetrics',
 *   useDefaultMetrics: true,
 *   metricsIgnoreFilePath: '/project/.metricsignore'
 * });
 * console.log(results);
 */
async function calculateMetrics ({
  codePath,
  customMetricsPath,
  useDefaultMetrics = true,
  useBuiltinMetrics, // Legacy support
  metricsIgnoreFilePath
} = {}) {
  const shouldUseDefault = useBuiltinMetrics !== undefined ? useBuiltinMetrics : useDefaultMetrics

  if (!shouldUseDefault && !customMetricsPath) {
    throw new Error(MESSAGES.ERRORS.ERROR_NO_METRICS)
  }

  if (!path.isAbsolute(codePath)) {
    throw new Error(`${MESSAGES.ERRORS.ERROR_CODE_PATH_NOT_ABSOLUTE} "${codePath}"`)
  }

  const codeFiles = await getFiles(codePath, metricsIgnoreFilePath)
  const ASTs = await constructASTs(codeFiles)

  const metricFiles = await loadMetricFiles(shouldUseDefault,
    customMetricsPath, __dirname)
  const metricObjects = await loadMetricObjects(metricFiles)

  return await executeMetrics(metricObjects, ASTs)
}

export { calculateMetrics }
