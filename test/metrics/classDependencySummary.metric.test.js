import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Class Dependency Summary Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/class-coupling/TS')
  const expressedFile = path.resolve(__dirname, '../test-src/class-coupling/TS/ExpressedClass.ts')
  const declaredFile = path.resolve(__dirname, '../test-src/class-coupling/TS/DeclaredClass.ts')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metric is defined with expected metadata', () => {
    expect(metricsResults).toHaveProperty('class-dependency-summary')
    expect(metricsResults['class-dependency-summary']).toHaveProperty('name', 'Class Dependency Summary')
    expect(metricsResults['class-dependency-summary'].description).toContain('Aggregates fan-in and fan-out dependency totals')
    expect(metricsResults['class-dependency-summary'].status).toBeTruthy()
  })

  it('computes class-level dependency aggregation for a simple fixture', () => {
    const result = metricsResults['class-dependency-summary'].result

    expect(result[expressedFile].ExpressedClass).toEqual({
      methods: 2,
      fanInCalls: 0,
      fanOutCalls: 2,
      fanInClasses: 0,
      fanOutClasses: 1,
      dependencyScore: 2
    })

    expect(result[declaredFile].DeclaredClass).toEqual({
      methods: 1,
      fanInCalls: 2,
      fanOutCalls: 0,
      fanInClasses: 1,
      fanOutClasses: 0,
      dependencyScore: 2
    })
  })
})
