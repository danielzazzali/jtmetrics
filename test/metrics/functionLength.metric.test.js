import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Function Length Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/functions-per-file')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metricsResults is defined', () => {
    expect(metricsResults).toBeDefined()
  })

  it('Function Length metric is defined, has correct name, description and status and contains result', () => {
    expect(metricsResults).toHaveProperty('function-length')
    expect(metricsResults['function-length']).toHaveProperty('name', 'Function Length')
    expect(metricsResults['function-length'].description).toBeDefined()
    expect(metricsResults['function-length'].description)
      .toContain('Counts line spans for named functions in each source file')
    expect(metricsResults['function-length'].result).toBeDefined()
    expect(metricsResults['function-length'].status).toBeTruthy()
    expect(metricsResults['function-length'].currentFile).toBeUndefined()
    expect(metricsResults['function-length'].dependencies).toBeUndefined()
  })

  it('Function Length result contains expected values', () => {
    const result = metricsResults['function-length'].result

    expect(result).toEqual({
      [`${codePath}/JS/functions.js`]: {
        foo: { lines: 3 },
        bar: { lines: 3 },
        qux: { lines: 3 },
        baz: { lines: 1 },
        add: { lines: 1 }
      },
      [`${codePath}/TS/functions.ts`]: {
        foo: { lines: 3 },
        bar: { lines: 3 },
        qux: { lines: 3 },
        baz: { lines: 2 },
        add: { lines: 1 }
      }
    })
  })
})
