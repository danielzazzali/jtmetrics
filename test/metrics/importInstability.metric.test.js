import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Import Instability Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/file-coupling/example-2')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metric is defined with expected metadata', () => {
    expect(metricsResults).toHaveProperty('import-instability')
    expect(metricsResults['import-instability']).toHaveProperty('name', 'Import Instability')
    expect(metricsResults['import-instability'].description).toContain('Computes afferent and efferent coupling')
    expect(metricsResults['import-instability'].status).toBeTruthy()
  })

  it('computes instability from file-level dependencies', () => {
    expect(metricsResults['import-instability'].result).toEqual({
      [`${codePath}/app.ts`]: {
        afferent: 0,
        efferent: 1,
        instability: 1
      },
      [`${codePath}/utils/index.ts`]: {
        afferent: 1,
        efferent: 0,
        instability: 0
      }
    })
  })
})
