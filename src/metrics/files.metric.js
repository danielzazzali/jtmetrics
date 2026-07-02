/** @type {import('../types.js').MetricState} */
const state = {
  name: 'Files on Repository',
  description: 'Collects and records all source files in the repository by their path.',
  result: {},
  id: 'files',
  status: false
}

/** @type {import('../types.js').MetricVisitors} */
const visitors = {
  /* Examples:
     /src/file.js
     /src/utils/helper.ts
  */
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}
  }
}

// Clean up state before finishing
/** @param {import('../types.js').MetricState} state */
function postProcessing (state) {
  delete state.currentFile

  const keys = Object.keys(state.result)
  state.result = keys.filter(k => !/^\d+$/.test(k))

  state.status = true
}

export { state, visitors, postProcessing }
