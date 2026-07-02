import { extname as getExt } from 'path'

/** @type {import('../types.js').MetricState} */
const state = {
  name: 'Function Coupling',
  description: 'Measures function-level coupling by recording Fan-In and Fan-Out relationships between functions',
  result: {},
  id: 'function-coupling',
  dependencies: ['functions-per-file'],
  status: false
}

/** @type {import('../types.js').MetricVisitors} */
const visitors = {
  // Entry point for each parsed file, load dependency and create functions array for each file
  Program (path) {
    state.currentFile = path.node.filePath
    state.result = state.dependencies['functions-per-file']
  },

  /* Examples:
     function foo() {}
     async function bar() {}
  */
  FunctionDeclaration (path) {
    if (!path.node.id || !path.node.id.name) return

    const callerFunction = path.node.id.name

    path.traverse({
      CallExpression (innerPath) {
        if (!innerPath.node.callee.name) {
          return
        }

        const calleeFunction = innerPath.node.callee.name
        let calleeFilePath = ''

        for (const filePath in state.dependencies['functions-per-file']) {
          const functions = state.dependencies['functions-per-file'][filePath]
          for (const functionName in functions) {
            if (calleeFunction === functionName && (getExt(filePath) === getExt(state.currentFile))) {
              calleeFilePath = filePath
            }
          }
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out']) {
          state.result[state.currentFile][callerFunction]['fan-out'] = {}
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]) {
          state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction] = 0
        }

        state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]++

        if (!state.result[calleeFilePath][calleeFunction]['fan-in']) {
          state.result[calleeFilePath][calleeFunction]['fan-in'] = {}
        }

        if (!state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]) {
          state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction] = 0
        }

        state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]++
      }
    })
  },

  /* Examples:
     const baz = function() {}
     const qux = async function() {}
  */
  FunctionExpression (path) {
    let callerFunction = ''

    if (path.parentPath.node.type === 'VariableDeclarator' && path.parentPath.node.id.name) {
      callerFunction = path.parentPath.node.id.name
    } else return

    path.traverse({
      CallExpression (innerPath) {
        if (!innerPath.node.callee.name) {
          return
        }

        const calleeFunction = innerPath.node.callee.name
        let calleeFilePath = ''

        for (const filePath in state.dependencies['functions-per-file']) {
          const functions = state.dependencies['functions-per-file'][filePath]
          for (const functionName in functions) {
            if (calleeFunction === functionName && (getExt(filePath) === getExt(state.currentFile))) {
              calleeFilePath = filePath
            }
          }
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out']) {
          state.result[state.currentFile][callerFunction]['fan-out'] = {}
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]) {
          state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction] = 0
        }

        state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]++

        if (!state.result[calleeFilePath][calleeFunction]['fan-in']) {
          state.result[calleeFilePath][calleeFunction]['fan-in'] = {}
        }

        if (!state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]) {
          state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction] = 0
        }

        state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]++
      }
    })
  },

  /* Examples:
     const add = () => {}
     items.map(item => item.value)
  */
  ArrowFunctionExpression (path) {
    if (!path.parentPath.node.id || !path.parentPath.node.id.name) return

    const callerFunction = path.parentPath.node.id.name

    path.traverse({
      CallExpression (innerPath) {
        if (!innerPath.node.callee.name) {
          return
        }

        const calleeFunction = innerPath.node.callee.name
        let calleeFilePath = ''

        for (const filePath in state.dependencies['functions-per-file']) {
          const functions = state.dependencies['functions-per-file'][filePath]
          for (const functionName in functions) {
            if (calleeFunction === functionName && (getExt(filePath) === getExt(state.currentFile))) {
              calleeFilePath = filePath
            }
          }
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out']) {
          state.result[state.currentFile][callerFunction]['fan-out'] = {}
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]) {
          state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction] = 0
        }

        state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]++

        if (!state.result[calleeFilePath][calleeFunction]['fan-in']) {
          state.result[calleeFilePath][calleeFunction]['fan-in'] = {}
        }

        if (!state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]) {
          state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction] = 0
        }

        state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]++
      }
    })
  }
}

// Clean up state before finishing
/** @param {import('../types.js').MetricState} state */
function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

export { state, visitors, postProcessing }
