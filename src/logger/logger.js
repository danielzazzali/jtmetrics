/**
 * Singleton logger to collect and retrieve errors across the application.
 *
 * Categories of errors:
 * - File errors
 * - Parse errors
 * - Metric errors
 * - AST traversal errors
 *
 * Provides methods to log errors and get copies of the stored error lists.
 */
class ErrorLogger {
  constructor () {
    /** @private @type {string[]} */
    this.fileErrors = []

    /** @private @type {string[]} */
    this.parseErrors = []

    /** @private @type {string[]} */
    this.metricErrors = []

    /** @private @type {string[]} */
    this.traverseErrors = []
  }

  /**
   * Returns the singleton instance of the logger.
   *
   * @returns {ErrorLogger} Singleton instance
   */
  static getInstance () {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  /**
   * Log a file-related error.
   * @param {string} msg - Error message
   */
  logFileError (msg) {
    this.fileErrors.push(msg)
  }

  /**
   * Log a parse-related error.
   * @param {string} msg - Error message
   */
  logParseError (msg) {
    this.parseErrors.push(msg)
  }

  /**
   * Log a metric-related error.
   * @param {string} msg - Error message
   */
  logMetricError (msg) {
    this.metricErrors.push(msg)
  }

  /**
   * Log an AST traversal error.
   * @param {string} msg - Error message
   */
  logTraverseError (msg) {
    this.traverseErrors.push(msg)
  }

  /**
   * Get a copy of all logged file errors.
   * @returns {string[]} File errors
   */
  getFileErrors () {
    return [...this.fileErrors]
  }

  /**
   * Get a copy of all logged parse errors.
   * @returns {string[]} Parse errors
   */
  getParseErrors () {
    return [...this.parseErrors]
  }

  /**
   * Get a copy of all logged metric errors.
   * @returns {string[]} Metric errors
   */
  getMetricErrors () {
    return [...this.metricErrors]
  }

  /**
   * Get a copy of all logged AST traversal errors.
   * @returns {string[]} Traverse errors
   */
  getTraverseErrors () {
    return [...this.traverseErrors]
  }
}

/** @type {ErrorLogger | undefined} */
ErrorLogger.instance

/** Singleton instance of the ErrorLogger */
export const logger = ErrorLogger.getInstance()
