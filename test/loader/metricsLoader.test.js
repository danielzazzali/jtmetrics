import { describe, expect, it, jest } from '@jest/globals'
import path from 'path'
import { loadMetricFiles, loadMetricObjects } from '../../src/loader/metricsLoader.js'
import { fileURLToPath } from 'url'
import { logger } from '../../src/logger/logger.js'
import { MESSAGES } from '../../src/constants/constants.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('metricsLoader.js', () => {
  describe('loadMetricFiles', () => {
    it('load metric files', async () => {
      const validMetricPath = path.resolve(__dirname, '../test-src/ignore-test/')
      const metricsFiles = await loadMetricFiles(true, validMetricPath, null)

      expect(metricsFiles.length).toBe(4)
    })

    it('throws if neither default nor custom metrics provided', async () => {
      const validMetricPath = path.resolve(__dirname, '../test-src/ignore-test/')
      await expect(loadMetricFiles(false, validMetricPath, null))
        .rejects
        .toThrow('No metrics to load provided: useDefaultMetrics:false, customMetricsPath:null')
    })

    it('not default metrics provided', async () => {
      const customValidMetricsPath = path.resolve(__dirname, '../test-src/ignore-test/metrics')
      const metricsFiles = await loadMetricFiles(false, '', customValidMetricsPath)

      expect(metricsFiles.length).toBe(4)
    })
  })

  describe('loadMetricObjects', () => {
    it('metric missing state and/or visitors objects and metric with no id and metric does not match regex', async () => {
      const spy = jest.spyOn(logger, 'logMetricError').mockImplementation(() => {})

      const validMetricPath = path.resolve(__dirname, '../test-src/ignore-test/')
      const metricsFiles = await loadMetricFiles(true, validMetricPath, null)

      const result = await loadMetricObjects(metricsFiles)

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining(`${MESSAGES.ERRORS.ERROR_IMPORTING_METRIC_FILE}`)
      )
      expect(result.length).toBe(1)
    })
  })
})
