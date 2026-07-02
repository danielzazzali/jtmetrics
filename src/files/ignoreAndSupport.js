import path from 'path'
import fs from 'fs/promises'
import {
  CJS_EXTENSION,
  FILE_ENCODING,
  JS_EXTENSION,
  LINE_BREAK,
  MESSAGES,
  TS_EXTENSION
} from '../constants/constants.js'
import { logger } from '../logger/logger.js'

/**
 * Reads a `.metricsignore` file and returns an array of absolute paths to ignore.
 *
 * @param {string} [ignoreMetricsFilePath] - Path to the `.metricsignore` file (optional).
 * @returns {Promise<string[]>} - List of absolute file paths to ignore.
 *
 * @example
 * const ignoredFiles = await getIgnored('/project/.metricsignore');
 * console.log(ignoredFiles); // ['/project/node_modules/foo.js', ...]
 */
async function getIgnored (ignoreMetricsFilePath) {
  let ignoreFiles = []

  if (!ignoreMetricsFilePath) return ignoreFiles

  try {
    const metricsIgnoreDirectory = path.dirname(ignoreMetricsFilePath)

    const data = await fs.readFile(ignoreMetricsFilePath, FILE_ENCODING)
    ignoreFiles = data.split(LINE_BREAK)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => path.resolve(metricsIgnoreDirectory, line))
  } catch (error) {
    logger.logFileError(`${MESSAGES.ERRORS.ERROR_READING_IGNORE_FILE} ${ignoreMetricsFilePath}: ${error.message}`)
  }

  return ignoreFiles
}

/**
 * Checks whether a file has a supported extension.
 * Supported extensions: `.js`, `.cjs`, `.ts`.
 *
 * @param {string} absolute - Absolute path of the file.
 * @returns {boolean} - True if the file is supported, false otherwise.
 *
 * @example
 * isSupported('/project/file.js'); // ⇒ true
 * isSupported('/project/file.py'); // ⇒ false
 */
function isSupported (absolute) {
  const ext = path.extname(absolute).toLowerCase()
  return [JS_EXTENSION, CJS_EXTENSION, TS_EXTENSION].includes(ext)
}

export { getIgnored, isSupported }
