import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Function Dependency Summary Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-1')
  const jsFile = path.resolve(__dirname, '../test-src/function-coupling/example-1/JS/functions-coupled.js')
  const tsFile = path.resolve(__dirname, '../test-src/function-coupling/example-1/TS/functions-coupled.ts')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metric is defined with expected metadata', () => {
    expect(metricsResults).toHaveProperty('function-dependency-summary')
    expect(metricsResults['function-dependency-summary']).toHaveProperty('name', 'Function Dependency Summary')
    expect(metricsResults['function-dependency-summary'].description).toContain('Aggregates fan-in and fan-out dependency totals')
    expect(metricsResults['function-dependency-summary'].status).toBeTruthy()
  })

  it('computes expected dependency summaries for JS and TS files', () => {
    expect(metricsResults['function-dependency-summary'].result[jsFile]).toEqual({
      foo: {
        type: 'FunctionDeclaration',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      bar: {
        type: 'FunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      qux: {
        type: 'FunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      baz: {
        type: 'FunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      add: {
        type: 'ArrowFunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      }
    })

    expect(metricsResults['function-dependency-summary'].result[tsFile]).toEqual({
      foo: {
        type: 'FunctionDeclaration',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      bar: {
        type: 'FunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      qux: {
        type: 'FunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      baz: {
        type: 'FunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      },
      add: {
        type: 'ArrowFunctionExpression',
        fanInCalls: 1,
        fanOutCalls: 1,
        fanInFunctions: 1,
        fanOutFunctions: 1,
        dependencyScore: 2
      }
    })
  })
})
