export const FILE_ENCODING = 'utf-8'
export const JS_EXTENSION = '.js'
export const CJS_EXTENSION = '.cjs'
export const TS_EXTENSION = '.ts'
export const LINE_BREAK = '\n'

/**
 * Default directory for metric files
 */
export const METRICS_PATH = 'metrics'

/**
 * Babel parser options for parsing JavaScript and TypeScript files.
 * @type {import('@babel/parser').ParserOptions}
 */
export const BABEL_PARSER_OPTIONS = {
  sourceType: 'unambiguous',
  plugins: [
    'typescript',
    'jsx'
  ]
}

/**
 * Centralized messages used for logging and error reporting.
 */
export const MESSAGES = {
  ERRORS: {
    ERROR_ON_FILE: 'Error on file',
    ERROR_READING_IGNORE_FILE: 'Error reading .metricsignore file at',
    ERROR_NO_METRICS: 'No metrics provided and useDefaultMetrics is set to false',
    MISSING_EXPORTS: 'Skipping metric file because it lacks the required exports { state, visitors }',
    PROCESSING_ERROR: 'Error processing metric file',
    ERROR_READING_SOURCE_CODE: 'Error reading source code on',
    ERROR_TRAVERSING_AST: 'Error traversing AST on metric',
    ERROR_INVALID_METRIC_ID: 'Invalid state.id',
    ID_MUST_MATCH_REGEX: 'Must match',
    METRIC_HAS_NO_ID: 'Metric has no id, state:',
    ERROR_PARSING_FILE: 'Error parsing file',
    ERROR_CODE_PATH_NOT_ABSOLUTE: 'codePath must be an absolute path. Received: ',
    ERROR_IMPORTING_METRIC_FILE: 'Error importing metric',
    NO_METRICS_TO_LOAD: 'No metrics to load provided'
  },
  INFO: {
    SKIPPING_FILE: 'Skipping file...'
  }
}

/**
 * Regular expression for validating metric IDs.
 * IDs must match npm package naming conventions.
 */
export const REGEX_METRICS_ID = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

/**
 * Keys to remove from AST nodes during cleanup to simplify comparison
 * and analysis (e.g., removing location data and comments).
 * @type {string[]}
 */
export const KEYS_TO_REMOVE = [
  'loc',
  'start',
  'end',
  'trailingComments',
  'leadingComments',
  'extra',
  'innerComments',
  'directives']

/**
 * Babel AST node type string constants used in node type comparisons.
 * @type {{ [key: string]: string }}
 */
export const AST_NODE_TYPES = {
  Program: 'Program',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  ClassExpression: 'ClassExpression',
  MemberExpression: 'MemberExpression',
  Identifier: 'Identifier',
  ThisExpression: 'ThisExpression',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  FunctionExpression: 'FunctionExpression',
  ObjectProperty: 'ObjectProperty',
  StringLiteral: 'StringLiteral',
  AssignmentExpression: 'AssignmentExpression'
}

/**
 * Babel AST method kind string constants.
 * @type {{ [key: string]: string }}
 */
export const METHOD_KINDS = {
  Constructor: 'constructor'
}

/**
 * Custom method name aliases used during metric computation.
 * @type {{ [key: string]: string }}
 */
export const METHOD_ALIASES = {
  Constructor: '_constructor'
}

/**
 * Special callee name string constants.
 * @type {{ [key: string]: string }}
 */
export const CALLEE_NAMES = {
  Require: 'require'
}
