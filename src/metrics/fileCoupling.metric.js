import path from 'path'
import fs from 'fs'

/** @type {import('../types.js').MetricState} */
const state = {
  name: 'File Coupling',
  description: 'Measures file-level coupling by computing each file’s fan-in (dependent files) and fan-out (dependencies)',
  result: {},
  id: 'file-coupling',
  dependencies: ['files'],
  status: false
}

/** @type {import('../types.js').MetricVisitors} */
const visitors = {
  // Entry point for each parsed file, load dependency
  Program (path) {
    state.currentFile = path.node.filePath
    state.result = state.dependencies.files
    state.result[state.currentFile] = []
  },

  ImportDeclaration (path) {
    const node = path.node
    const importSource = node.source.value
    const absoluteImport = resolveImportPath(state.currentFile, importSource)

    if (!absoluteImport) return

    state.result[state.currentFile].push(absoluteImport)
  },

  CallExpression (path) {
    const node = path.node

    // Ignore error if it's highlighted, arguments property is a valid Array from the AST node
    const args = node.arguments

    if (
      node.callee.name === 'require' &&
      args.length === 1 &&
      args[0].type === 'StringLiteral'
    ) {
      const importSource = args[0].value
      const absoluteImport = resolveImportPath(state.currentFile, importSource)

      if (!absoluteImport) return

      state.result[state.currentFile].push(absoluteImport)
    }
  },

  TSImportEqualsDeclaration (path) {
    const node = path.node
    const importSource = node.moduleReference.expression.value
    const absoluteImport = resolveImportPath(state.currentFile, importSource)

    if (!absoluteImport) return

    state.result[state.currentFile].push(absoluteImport)
  }
}

function resolveImportPath (importingFile, importSource) {
  if (!importSource.startsWith('.') && !path.isAbsolute(importSource)) return null

  const EXTENSIONS = ['.js', '.cjs', '.ts', '.jsx', '.tsx', '.json']

  const basePath = path.resolve(path.dirname(importingFile), importSource)

  // 1. Exact path
  if (fs.existsSync(basePath) && fs.lstatSync(basePath).isFile()) return basePath

  // 2. Try with extensions
  for (const ext of EXTENSIONS) {
    const fullPath = basePath + ext
    if (fs.existsSync(fullPath)) return fullPath
  }

  // 3. Try index files in directory
  for (const ext of EXTENSIONS) {
    const indexPath = path.join(basePath, 'index' + ext)
    if (fs.existsSync(indexPath)) return indexPath
  }

  // Not found
  return null
}

// Clean up and compute fanIn/fanOut before finishing
/** @param {import('../types.js').MetricState} state */
function postProcessing (state) {
  const raw = state.result

  const processed = {}

  // ensure every file has an entry
  for (const filePath of Object.keys(raw)) {
    processed[filePath] = { fanOut: Array.from(new Set(raw[filePath])), fanIn: [] }
  }

  // also create entries for files that are only imported (not top-level keys)
  for (const filePath of Object.keys(raw)) {
    for (const imp of raw[filePath]) {
      if (!processed[imp]) processed[imp] = { fanOut: [], fanIn: [] }
    }
  }

  // invert edges: for each A -> B, add A to B.fanIn
  for (const filePath of Object.keys(processed)) {
    for (const imp of processed[filePath].fanOut) {
      processed[imp].fanIn.push(filePath)
    }
  }

  // dedupe fanIn lists
  for (const p of Object.keys(processed)) {
    processed[p].fanIn = Array.from(new Set(processed[p].fanIn))
  }

  state.result = processed
  delete state.currentFile
  delete state.dependencies
  state.status = true
}

export { state, visitors, postProcessing }
