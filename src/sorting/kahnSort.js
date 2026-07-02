import { deleteMin, empty, findMin, insert, isEmpty } from '../data-structures/leftistMinHeap.js'
import { logger } from '../logger/logger.js'

/**
 * Performs a lexicographically-ordered topological sort (Kahn's algorithm) on a set of metric objects.
 * Each metric must have a unique `state.id` and a list of `state.dependencies` (IDs of prerequisite metrics).
 * Uses a leftist min-heap to always select the next metric with the smallest `state.id` among those with zero indegree.
 *
 * @param {import('../types.js').MetricObject[]} metrics
 *   - Array of metric objects. Each object should have:
 *     - `state.id`         : a unique, comparable identifier (e.g., string or number).
 *     - `state.dependencies`: an array of IDs that this metric depends on.
 *
 * @returns {import('../types.js').MetricObject[] | null}
 *   - Sorted array of metrics in topological order (by `state.id` tie-break) if no cycle is detected.
 *   - `null` if the dependency graph contains a cycle (i.e., not all metrics can be ordered).
 *
 * @example
 * import { deleteMin, empty, findMin, insert, isEmpty } from '../data-structures/leftistMinHeap.js';
 *
 * const metrics = [metricA, metricB, metricC];
 * const sorted = kahnSort(metrics);
 * if (sorted) {
 *   sorted.forEach(m => console.log(m.state.id));
 * } else {
 *   console.error('Cycle detected: cannot produce topological order.');
 * }
 */
function kahnSort (metrics) {
  /**
   * Adjacency list mapping each metric ID to the list of dependent IDs.
   * @type {Record<string, Array<string|number>>}
   */
  const adj = {}

  /**
   * Map of metric ID to its current indegree (number of unmet prerequisites).
   * @type {Record<string, number>}
   */
  const indegree = {}

  /**
   * Quick lookup from metric ID to the metric object.
   * @type {Record<string, import('../types.js').MetricObject>}
   */
  const metricMap = {}

  // Initialize structures for each metric
  for (const m of metrics) {
    const id = m.state.id
    if (metricMap[id] !== undefined) {
      throw new Error(`Duplicate metric ID detected: ${id}`)
    }
    metricMap[id] = m
    indegree[id] = 0
    adj[id] = []
  }

  for (const m of metrics) {
    for (const dep of m.state.dependencies ?? []) {
      if (!(dep in metricMap)) {
        logger.logMetricError(
          `Dependency ${dep} not found for metric ${m.state.id}, deleting from dependencies.`
        )
        m.state.dependencies = m.state.dependencies.filter(d => d !== dep)
      }
    }
  }

  // Build graph edges (prerequisite → dependent)
  for (const m of metrics) {
    const id = m.state.id
    for (const prereq of m.state.dependencies ?? []) {
      adj[prereq].push(id)
      indegree[id] += 1
    }
  }

  // Initialize a min-heap of metrics with zero indegree
  /** @type {import('../data-structures/leftistMinHeap.js').Node | null} */
  let heap = empty
  for (const id of Object.keys(indegree)) {
    if (indegree[id] === 0) {
      heap = insert(metricMap[id], heap)
    }
  }

  /**
   * Resulting list of metrics in topologically sorted order.
   * @type {import('../types.js').MetricObject[]}
   */
  const order = []

  // Process until no more metrics are available
  while (!isEmpty(heap)) {
    // Extract the next metric with the smallest state.id
    const m = findMin(heap)
    heap = deleteMin(heap)
    order.push(m)

    // Decrease indegree of each dependent and add to heap if it becomes zero
    for (const depId of adj[m.state.id]) {
      indegree[depId] -= 1
      if (indegree[depId] === 0) {
        heap = insert(metricMap[depId], heap)
      }
    }
  }

  // If we sorted all metrics, return the order; otherwise, a cycle exists
  return order.length === metrics.length ? order : null
}

export { kahnSort }
