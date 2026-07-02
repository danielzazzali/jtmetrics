import traverse from '@babel/traverse'
import { MESSAGES } from '../constants/constants.js'
import { kahnSort } from '../sorting/kahnSort.js'
import { logger } from '../logger/logger.js'

/**
 * Sorts metric objects by dependency order and initializes the result map.
 *
 * @param {import('../types.js').MetricObject[]} metricObjects - Array of metric definitions.
 * @returns {{ sortedMetrics: import('../types.js').MetricObject[], resultMap: Object.<string, *> }}
 * Sorted metrics and an empty result map.
 */
function sortAndInit (metricObjects) {
  const sortedMetrics = /** @type {import('../types.js').MetricObject[]} */ (kahnSort(metricObjects))
  const resultMap = {}
  return { sortedMetrics, resultMap }
}

/**
 * Resolves dependencies for a single metric by replacing dependency IDs
 * with deep copies of the corresponding metric results.
 *
 * @param {import('../types.js').MetricObject} metric - The current metric object.
 * @param {Object.<string, *>} resultMap - Map of metric results by ID.
 */
function resolveDependencies (metric, resultMap) {
  if (!metric.state.dependencies) return

  const deps = metric.state.dependencies
  metric.state.dependencies = {}

  for (const depId of deps) {
    metric.state.dependencies[depId] = structuredClone(resultMap[depId])
  }
}

/**
 * Traverses all ASTs with the given metric's visitors.
 * Logs errors if traversal fails for any AST.
 *
 * @param {import('../types.js').MetricObject} metric - Metric containing visitors and state.
 * @param {Object[]} ASTs - List of ASTs to traverse with file path metadata.
 */
function traverseASTs (metric, ASTs) {
  const visitorsArray = [metric.visitors]

  for (const visitors of visitorsArray) {
    for (const ast of ASTs) {
      try {
        traverse.default(ast, visitors, undefined, metric.state)
      } catch (error) {
        logger.logTraverseError(
          `${MESSAGES.ERRORS.ERROR_TRAVERSING_AST} ${metric.state.id} -> ${ast.program.filePath}: ${error}`
        )
      }
    }
  }
}

/**
 * Executes optional post-processing on a metric and stores the final result.
 *
 * @param {import('../types.js').MetricObject} metric - Metric to process.
 * @param {Object.<string, *>} resultMap - Map of metric results by ID.
 */
function postProcessAndStore (metric, resultMap) {
  if (metric.postProcessing) {
    metric.postProcessing(metric.state)
  }
  resultMap[metric.state.id] = metric.state.result
}

/**
 * Builds the final output object containing all metrics' results and errors.
 *
 * @param {import('../types.js').MetricObject[]} sortedMetrics - List of processed metrics.
 * @param {Object.<string, *>} resultMap - Map of metric results by ID.
 * @returns {import('../types.js').MetricsOutput} Final result object with metrics and error logs.
 */
function buildFinalResult (sortedMetrics, resultMap) {
  const output = {}

  for (const metric of sortedMetrics) {
    /* istanbul ignore next */
    if (metric.state.ignore && process.env.SKIP_IGNORE !== 'true') continue

    const { id, ...stateWithoutId } = metric.state
    output[id] = stateWithoutId
  }

  // Append logger errors
  output.errors = {
    file: logger.getFileErrors(),
    parse: logger.getParseErrors(),
    metric: logger.getMetricErrors(),
    traverse: logger.getTraverseErrors()
  }
  return /** @type {import('../types.js').MetricsOutput} */ (output)
}

/**
 * Runs all metrics against provided ASTs:
 * - Sorts metrics by dependency order.
 * - Resolves dependencies for each metric.
 * - Traverses ASTs with metric visitors.
 * - Runs post-processing and compiles results.
 *
 * @param {import('../types.js').MetricObject[]} metricObjects - List of metric definitions.
 * @param {Object[]} ASTs - List of parsed ASTs to analyze.
 * @returns {Promise<import('../types.js').MetricsOutput>} Final result object with metrics and error logs.
 */
async function executeMetrics (metricObjects, ASTs) {
  const { sortedMetrics, resultMap } = sortAndInit(metricObjects)

  for (const metric of sortedMetrics) {
    resolveDependencies(metric, resultMap)
    traverseASTs(metric, ASTs)
    resultMap[metric.state.id] = metric.state.result
  }

  for (const metric of sortedMetrics) {
    postProcessAndStore(metric, resultMap)
  }

  return buildFinalResult(sortedMetrics, resultMap)
}

export { executeMetrics }
