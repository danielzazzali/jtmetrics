import fs from 'fs'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import { BABEL_PARSER_OPTIONS } from '../constants/constants.js'

const state = {
  name: 'Function Length',
  description: 'Counts line spans for named functions in each source file',
  result: {},
  id: 'function-length',
  dependencies: ['functions-per-file'],
  status: false
}

function getNodeLength (source, node) {
  if (node.start == null || node.end == null) return 0

  const snippet = source.slice(node.start, node.end)
  if (snippet.length === 0) return 0
  return snippet.split(/\r?\n/).length
}

function buildLengthMap (filePath) {
  const source = fs.readFileSync(filePath, 'utf-8')
  const ast = parse(source, BABEL_PARSER_OPTIONS)
  const lengthByName = {}

  traverse.default(ast, {
    FunctionDeclaration (path) {
      if (!path.node.id || !path.node.id.name) return
      lengthByName[path.node.id.name] = getNodeLength(source, path.node)
    },
    FunctionExpression (path) {
      if (path.parentPath.node.type !== 'VariableDeclarator') return
      if (!path.parentPath.node.id || !path.parentPath.node.id.name) return
      lengthByName[path.parentPath.node.id.name] = getNodeLength(source, path.node)
    },
    ArrowFunctionExpression (path) {
      if (!path.parentPath.node.id || !path.parentPath.node.id.name) return
      lengthByName[path.parentPath.node.id.name] = getNodeLength(source, path.node)
    }
  })

  return lengthByName
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}

    const currentFileFunctions = state.dependencies['functions-per-file'][state.currentFile] || {}
    const lengthByName = buildLengthMap(state.currentFile)

    for (const functionName of Object.keys(currentFileFunctions)) {
      state.result[state.currentFile][functionName] = {
        lines: lengthByName[functionName] ?? 0
      }
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

export { state, visitors, postProcessing }
