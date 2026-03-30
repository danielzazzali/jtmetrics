import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Dependency Centrality Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/file-coupling/example-2')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metric is defined with expected metadata', () => {
    expect(metricsResults).toHaveProperty('dependency-centrality')
    expect(metricsResults['dependency-centrality']).toHaveProperty('name', 'Dependency Centrality')
    expect(metricsResults['dependency-centrality'].description).toContain('Computes in-degree, out-degree')
    expect(metricsResults['dependency-centrality'].status).toBeTruthy()
  })

  it('computes degree centrality from file dependency graph', () => {
    expect(metricsResults['dependency-centrality'].result).toEqual({
      [`${codePath}/app.ts`]: {
        inDegree: 0,
        outDegree: 1,
        inDegreeCentrality: 0,
        outDegreeCentrality: 1,
        totalDegreeCentrality: 0.5
      },
      [`${codePath}/utils/index.ts`]: {
        inDegree: 1,
        outDegree: 0,
        inDegreeCentrality: 1,
        outDegreeCentrality: 0,
        totalDegreeCentrality: 0.5
      }
    })
  })
})
