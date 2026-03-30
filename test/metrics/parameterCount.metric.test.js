import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Parameter Count Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/functions-per-file')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metricsResults is defined', () => {
    expect(metricsResults).toBeDefined()
  })

  it('Parameter Count metric is defined, has correct name, description and status and contains result', () => {
    expect(metricsResults).toHaveProperty('parameter-count')
    expect(metricsResults['parameter-count']).toHaveProperty('name', 'Parameter Count')
    expect(metricsResults['parameter-count'].description).toBeDefined()
    expect(metricsResults['parameter-count'].description)
      .toContain('Counts declared parameters for each named function in each source file')
    expect(metricsResults['parameter-count'].result).toBeDefined()
    expect(metricsResults['parameter-count'].status).toBeTruthy()
    expect(metricsResults['parameter-count'].currentFile).toBeUndefined()
    expect(metricsResults['parameter-count'].dependencies).toBeUndefined()
  })

  it('Parameter Count result contains expected values', () => {
    const result = metricsResults['parameter-count'].result

    expect(result).toEqual({
      [`${codePath}/JS/functions.js`]: {
        foo: { params: 0 },
        bar: { params: 0 },
        qux: { params: 0 },
        baz: { params: 0 },
        add: { params: 2 }
      },
      [`${codePath}/TS/functions.ts`]: {
        foo: { params: 0 },
        bar: { params: 0 },
        qux: { params: 0 },
        baz: { params: 0 },
        add: { params: 2 }
      }
    })
  })
})
