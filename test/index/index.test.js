import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeAll, describe, expect, it } from '@jest/globals'
import { MESSAGES } from '../../src/constants/constants.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('index.js', function () {
  describe('calculateMetrics', function () {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling')
    let metricsResults

    beforeAll(async function () {
      metricsResults = await calculateMetrics({ codePath })
    })

    it('codePath is defined', () => {
      expect(codePath).toBeDefined()
    })

    it('metricsResults is defined', () => {
      expect(metricsResults).toBeDefined()
    })

    it('Should contain metric files with status true', function () {
      expect(metricsResults.files).toHaveProperty('status', true)
    })

    it('Should contain metric functions-per-file with status true', function () {
      expect(metricsResults['functions-per-file']).toHaveProperty('status', true)
    })

    it('Should contain metric file-coupling with status true', function () {
      expect(metricsResults['file-coupling']).toHaveProperty('status', true)
    })

    it('Should contain metric function-coupling with status true', function () {
      expect(metricsResults['function-coupling']).toHaveProperty('status', true)
    })

    it('Should contain metric lines-per-file with status true', function () {
      expect(metricsResults['lines-per-file']).toHaveProperty('status', true)
    })

    it('Should contain metric function-length with status true', function () {
      expect(metricsResults['function-length']).toHaveProperty('status', true)
    })

    it('Should contain metric parameter-count with status true', function () {
      expect(metricsResults['parameter-count']).toHaveProperty('status', true)
    })

    it('Should contain metric import-instability with status true', function () {
      expect(metricsResults['import-instability']).toHaveProperty('status', true)
    })

    it('Should contain metric dependency-centrality with status true', function () {
      expect(metricsResults['dependency-centrality']).toHaveProperty('status', true)
    })

    it('Should contain metric function-dependency-summary with status true', function () {
      expect(metricsResults['function-dependency-summary']).toHaveProperty('status', true)
    })

    it('Should contain metric class-dependency-summary with status true', function () {
      expect(metricsResults['class-dependency-summary']).toHaveProperty('status', true)
    })

    it('Should contain metric classes-per-file with status true', function () {
      expect(metricsResults['classes-per-file']).toHaveProperty('status', true)
    })

    it('Should contain metric class-coupling with status true', function () {
      expect(metricsResults['class-coupling']).toHaveProperty('status', true)
    })

    it('Should contain metric instance-mapper (helper metric) because in testing the skip is ignored', function () {
      expect(metricsResults['instance-mapper']).toHaveProperty('status', true)
    })

    it('Should throw error if no default or custom metrics are provided', async function () {
      await expect(
        calculateMetrics({
          codePath,
          useDefaultMetrics: false,
          customMetricsPath: null
        })
      ).rejects.toThrow(MESSAGES.ERRORS.ERROR_NO_METRICS)
    })

    it('Should throw an error when called with no arguments', async function () {
      await expect(calculateMetrics()).rejects.toThrow()
    })

    it('Should resolve a relative codePath using path.resolve', async function () {
      const relativePath = '../test-src/function-coupling'

      await expect(
        calculateMetrics({
          codePath: relativePath
        })
      ).rejects.toThrow(
        `${MESSAGES.ERRORS.ERROR_CODE_PATH_NOT_ABSOLUTE} "${relativePath}"`
      )
    })
  })
})
