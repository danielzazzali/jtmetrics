/**
 * @typedef {Object} CalculateMetricsOptions
 * @property {string} [codePath] - Absolute path to the target code directory (required at runtime)
 * @property {string} [customMetricsPath] - Path to additional custom metrics
 * @property {boolean} [useDefaultMetrics] - Whether to include default metrics (default true)
 * @property {boolean} [useBuiltinMetrics] - DEPRECATED: Alias for useDefaultMetrics
 * @property {string} [metricsIgnoreFilePath] - Path to a .metricsignore file
 */

/**
 * @typedef {Object} FileEntry
 * @property {string} filePath - Absolute path to the file
 * @property {string} fileName - File name (basename)
 */

/**
 * @typedef {Object} MetricState
 * @property {string} name - Display name of the metric
 * @property {string} description - Description of what the metric measures
 * @property {*} result - Accumulated result data
 * @property {string} id - Unique metric identifier
 * @property {*} [dependencies] - String[] before resolution, Object<string, *> after resolution
 * @property {boolean} status - Whether metric execution completed successfully
 * @property {boolean} [ignore] - If true, metric is hidden unless SKIP_IGNORE=true
 * @property {*} [currentFile] - File path of the file being processed (runtime only)
 */

/**
 * A single Babel visitor function.
 * @callback MetricVisitor
 * @param {*} path - Babel NodePath
 * @param {*} state - Metric state
 * @returns {void}
 */

/**
 * Babel visitor functions keyed by AST node type.
 * @typedef {Object<string, MetricVisitor>} MetricVisitors
 */

/**
 * Optional post-processing function called after AST traversal.
 * @callback MetricPostProcessing
 * @param {MetricState} state - The metric's state after traversal
 * @returns {void}
 */

/**
 * @typedef {Object} MetricObject
 * @property {MetricState} state - Metric state/configuration
 * @property {MetricVisitors} visitors - Babel visitor functions
 * @property {MetricPostProcessing} [postProcessing] - Optional post-processing
 */

/**
 * @typedef {Object} ErrorLogs
 * @property {string[]} file - File-related errors
 * @property {string[]} parse - Parse-related errors
 * @property {string[]} metric - Metric-related errors
 * @property {string[]} traverse - AST traversal errors
 */

/**
 * Entry for a single metric in the final output.
 * @typedef {Object} MetricResultEntry
 * @property {string} name - Display name
 * @property {string} description - Description
 * @property {*} result - Metric result data
 * @property {boolean} status - Completion status
 * @property {string[]} [dependencies] - Dependency IDs
 * @property {boolean} [ignore] - Hidden flag
 */

/**
 * The complete return type of calculateMetrics.
 * Each metric ID maps to its result entry, plus an `errors` key.
 * @typedef {{ [metricId: string]: MetricResultEntry } & { errors: ErrorLogs }} MetricsOutput
 */

// ---- Per-metric result types ----

/**
 * @typedef {string[]} FilesResult
 */

/**
 * @typedef {Object} LinesPerFileEntry
 * @property {number} total - Total lines
 * @property {number} nonEmpty - Non-empty lines
 * @property {number} blank - Blank lines
 */

/**
 * @typedef {Object<string, LinesPerFileEntry>} LinesPerFileResult
 */

/**
 * @typedef {Object<string, Object<string, *>>} FunctionsPerFileResult
 */

/**
 * @typedef {Object} FunctionLengthEntry
 * @property {number} lines - Line count for the function
 */

/**
 * @typedef {Object<string, Object<string, FunctionLengthEntry>>} FunctionLengthResult
 */

/**
 * @typedef {Object} ParameterCountEntry
 * @property {number} params - Number of parameters
 */

/**
 * @typedef {Object<string, Object<string, ParameterCountEntry>>} ParameterCountResult
 */

/**
 * @typedef {Object} FunctionCouplingEntry
 * @property {string} type - Function type
 * @property {Object<string, number>} [fan-in] - Callers mapping to call count
 * @property {Object<string, number>} [fan-out] - Callees mapping to call count
 */

/**
 * @typedef {Object<string, Object<string, FunctionCouplingEntry>>} FunctionCouplingResult
 */

/**
 * @typedef {Object} FunctionDependencySummaryEntry
 * @property {string} type - Function type
 * @property {number} fanInCalls - Total incoming call count
 * @property {number} fanOutCalls - Total outgoing call count
 * @property {number} fanInFunctions - Number of distinct calling functions
 * @property {number} fanOutFunctions - Number of distinct called functions
 * @property {number} dependencyScore - Sum of fanInCalls + fanOutCalls
 */

/**
 * @typedef {Object<string, Object<string, FunctionDependencySummaryEntry>>} FunctionDependencySummaryResult
 */

/**
 * @typedef {Object<string, Object<string, *[]>>} ClassesPerFileResult
 */

/**
 * @typedef {Object<string, Object<string, *[]>>} ClassCouplingResult
 */

/**
 * @typedef {Object} ClassDependencySummaryEntry
 * @property {number} methods - Number of methods in the class
 * @property {number} fanInCalls - Total incoming call count
 * @property {number} fanOutCalls - Total outgoing call count
 * @property {number} fanInClasses - Number of distinct calling classes
 * @property {number} fanOutClasses - Number of distinct called classes
 * @property {number} dependencyScore - Sum of fanInCalls + fanOutCalls
 */

/**
 * @typedef {Object<string, Object<string, ClassDependencySummaryEntry>>} ClassDependencySummaryResult
 */

/**
 * @typedef {Object} FileCouplingEntry
 * @property {string[]} fanOut - Files this file imports from
 * @property {string[]} fanIn - Files that import this file
 */

/**
 * @typedef {Object<string, FileCouplingEntry>} FileCouplingResult
 */

/**
 * @typedef {Object} ImportInstabilityEntry
 * @property {number} afferent - Incoming dependencies (Ca)
 * @property {number} efferent - Outgoing dependencies (Ce)
 * @property {number} instability - Instability score I = Ce / (Ca + Ce)
 */

/**
 * @typedef {Object<string, ImportInstabilityEntry>} ImportInstabilityResult
 */

/**
 * @typedef {Object} DependencyCentralityEntry
 * @property {number} inDegree - Number of incoming dependencies
 * @property {number} outDegree - Number of outgoing dependencies
 * @property {number} inDegreeCentrality - inDegree / (totalFiles - 1)
 * @property {number} outDegreeCentrality - outDegree / (totalFiles - 1)
 * @property {number} totalDegreeCentrality - (inDegree + outDegree) / (2 * (totalFiles - 1))
 */

/**
 * @typedef {Object<string, DependencyCentralityEntry>} DependencyCentralityResult
 */

/**
 * @typedef {Object<string, Object<string, Object<string, string>>>} InstanceMapperResult
 */

/**
 * Union of all Babel AST node type strings used in metric comparisons.
 * @typedef {'Program' | 'ExportNamedDeclaration' | 'ExportDefaultDeclaration' | 'VariableDeclarator' | 'ClassExpression' | 'MemberExpression' | 'Identifier' | 'ThisExpression' | 'ArrowFunctionExpression' | 'FunctionExpression' | 'ObjectProperty' | 'StringLiteral' | 'AssignmentExpression'} ASTNodeType
 */

export {}
