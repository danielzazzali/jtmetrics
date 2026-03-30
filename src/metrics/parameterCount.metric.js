const state = {
  name: 'Parameter Count',
  description: 'Counts declared parameters for each named function in each source file',
  result: {},
  id: 'parameter-count',
  dependencies: ['functions-per-file'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}

    const currentFileFunctions = state.dependencies['functions-per-file'][state.currentFile] || {}

    for (const [functionName, functionNode] of Object.entries(currentFileFunctions)) {
      state.result[state.currentFile][functionName] = {
        params: functionNode.params?.length ?? 0
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
