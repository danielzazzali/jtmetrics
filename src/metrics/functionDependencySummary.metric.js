function sumValues (obj) {
  return Object.values(obj).reduce((acc, value) => acc + value, 0)
}

const state = {
  name: 'Function Dependency Summary',
  description: 'Aggregates fan-in and fan-out dependency totals for each named function',
  result: {},
  id: 'function-dependency-summary',
  dependencies: ['function-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}

    const functionCouplingResult = state.dependencies['function-coupling'][state.currentFile] || {}

    for (const [functionName, functionNode] of Object.entries(functionCouplingResult)) {
      const fanInMap = functionNode['fan-in'] || {}
      const fanOutMap = functionNode['fan-out'] || {}
      const fanInCalls = sumValues(fanInMap)
      const fanOutCalls = sumValues(fanOutMap)

      state.result[state.currentFile][functionName] = {
        type: functionNode.type,
        fanInCalls,
        fanOutCalls,
        fanInFunctions: Object.keys(fanInMap).length,
        fanOutFunctions: Object.keys(fanOutMap).length,
        dependencyScore: fanInCalls + fanOutCalls
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
