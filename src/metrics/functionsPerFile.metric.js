/** @type {import('../types.js').MetricState} */
const state = {
  name: 'Functions Per File',
  description: 'Records all named functions in each source file, mapping function names to their AST node',
  result: {},
  id: 'functions-per-file',
  dependencies: ['files'],
  status: false
}

/** @type {import('../types.js').MetricVisitors} */
const visitors = {
  // Entry point for each parsed file, load dependency and create functions array for each file
  Program (path) {
    state.currentFile = path.node.filePath
    state.result = state.dependencies.files
    state.result[state.currentFile] = {}
  },

  /* Examples:
     function foo() {}
     async function bar() {}
  */
  FunctionDeclaration (path) {
    if (!path.node.id || !path.node.id.name) return

    const functionName = path.node.id.name

    state.result[state.currentFile][functionName] = path.node
  },

  /* Examples:
     const baz = function() {}
     const qux = async function() {}
  */
  FunctionExpression (path) {
    let functionName = ''

    if (path.parentPath.node.type === 'VariableDeclarator' && path.parentPath.node.id.name) {
      functionName = path.parentPath.node.id.name
    } else return

    state.result[state.currentFile][functionName] = path.node
  },

  /* Examples:
     const add = () => {}
     items.map(item => item.value)
  */
  ArrowFunctionExpression (path) {
    if (!path.parentPath.node.id || !path.parentPath.node.id.name) return

    const functionName = path.parentPath.node.id.name

    state.result[state.currentFile][functionName] = path.node
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
