import fs from 'fs/promises'
import { parse } from '@babel/parser'
import { BABEL_PARSER_OPTIONS, FILE_ENCODING, KEYS_TO_REMOVE, MESSAGES } from '../constants/constants.js'
import { logger } from '../logger/logger.js'

/**
 * Recursively removes specified keys (like location info) from the AST.
 *
 * @param {object|Array} node - The AST node or array of nodes to clean.
 */
function cleanAST (node) {
  if (node === null) return

  if (Array.isArray(node)) {
    // If the node is an array, recursively clean each child
    for (const child of node) {
      cleanAST(child)
    }
    return
  }

  // Remove each location key if present
  for (const key of KEYS_TO_REMOVE) {
    if (key in node) {
      delete node[key]
    }
  }

  // Recurse into any child objects or arrays
  for (const value of Object.values(node)) {
    if (value && (Array.isArray(value) || typeof value === 'object')) {
      cleanAST(value)
    }
  }
}

/**
 * Reads the source code from a file.
 *
 * @param {string} filePath - Path to the source file.
 * @returns {Promise<string|null>} File contents or null if read fails.
 */
async function getSourceCode (filePath) {
  try {
    return await fs.readFile(filePath, FILE_ENCODING)
  } catch (error) {
    logger.logFileError(`${MESSAGES.ERRORS.ERROR_READING_SOURCE_CODE} ${filePath}: ${error.message}`)
    return null
  }
}

/**
 * Parses source code into an AST.
 *
 * @param {string} filePath - Path to the source file.
 * @returns {Promise<object|null>} Parsed AST or null if parsing fails.
 */
async function getAST (filePath) {
  const code = await getSourceCode(filePath)
  if (!code) return null

  try {
    return parse(code, BABEL_PARSER_OPTIONS)
  } catch (error) {
    logger.logParseError(`${MESSAGES.ERRORS.ERROR_PARSING_FILE} ${filePath}: ${error.message}`)
    return null
  }
}

/**
 * Constructs cleaned ASTs for a given list of files.
 *
 * @param {import('../types.js').FileEntry[]} files - List of files to parse.
 * @returns {Promise<Object[]>} List of cleaned ASTs with file path metadata.
 */
async function constructASTs (files) {
  const astPromises = files.map(async (file) => {
    const ast = await getAST(file.filePath)

    if (ast === null) return

    cleanAST(ast)

    // Add metadata to AST
    ast.program.filePath = file.filePath

    return ast
  })

  const results = await Promise.all(astPromises)

  return results.filter((ast) => ast != null)
}

export { constructASTs }
