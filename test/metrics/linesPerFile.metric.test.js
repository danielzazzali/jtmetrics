import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Lines Per File Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/functions-per-file')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metricsResults is defined', () => {
    expect(metricsResults).toBeDefined()
  })

  it('Lines Per File metric is defined, has correct name, description and status and contains result', () => {
    expect(metricsResults).toHaveProperty('lines-per-file')
    expect(metricsResults['lines-per-file']).toHaveProperty('name', 'Lines Per File')
    expect(metricsResults['lines-per-file'].description).toBeDefined()
    expect(metricsResults['lines-per-file'].description)
      .toContain('Counts total and non-empty lines for each analyzed source file')
    expect(metricsResults['lines-per-file'].result).toBeDefined()
    expect(metricsResults['lines-per-file'].status).toBeTruthy()
    expect(metricsResults['lines-per-file'].currentFile).toBeUndefined()
    expect(metricsResults['lines-per-file'].dependencies).toBeUndefined()
  })

  it('Lines Per File result contains expected counts', () => {
    const result = metricsResults['lines-per-file'].result

    expect(result).toEqual({
      [`${codePath}/JS/functions.js`]: {
        total: 31,
        nonEmpty: 24,
        blank: 7
      },
      [`${codePath}/TS/functions.ts`]: {
        total: 34,
        nonEmpty: 27,
        blank: 7
      }
    })
  })
})
