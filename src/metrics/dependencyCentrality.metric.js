function roundTo4 (value) {
  return Number(value.toFixed(4))
}

function buildCouplingGraph (rawFileCoupling) {
  const graph = {}
  const fanInMap = {}

  for (const [filePath, fanOut] of Object.entries(rawFileCoupling || {})) {
    graph[filePath] = Array.isArray(fanOut)
      ? Array.from(new Set(fanOut.filter(dep => typeof dep === 'string')))
      : []
    fanInMap[filePath] = fanInMap[filePath] || []
  }

  for (const [filePath, fanOut] of Object.entries(graph)) {
    for (const dep of fanOut) {
      if (!graph[dep]) graph[dep] = []
      if (!fanInMap[dep]) fanInMap[dep] = []
      fanInMap[dep].push(filePath)
    }
  }

  for (const filePath of Object.keys(fanInMap)) {
    fanInMap[filePath] = Array.from(new Set(fanInMap[filePath]))
  }

  const result = {}
  for (const filePath of Object.keys(graph)) {
    result[filePath] = {
      fanOut: graph[filePath],
      fanIn: fanInMap[filePath] || []
    }
  }

  return result
}

const state = {
  name: 'Dependency Centrality',
  description: 'Computes in-degree, out-degree, and degree centrality from the file dependency graph',
  result: {},
  id: 'dependency-centrality',
  dependencies: ['file-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
  }
}

function postProcessing (state) {
  const fileCouplingResult = buildCouplingGraph(state.dependencies['file-coupling'])
  const totalFiles = Object.keys(fileCouplingResult).length
  const denominator = Math.max(totalFiles - 1, 1)

  for (const [filePath, coupling] of Object.entries(fileCouplingResult)) {
    const inDegree = coupling.fanIn.length
    const outDegree = coupling.fanOut.length

    state.result[filePath] = {
      inDegree,
      outDegree,
      inDegreeCentrality: roundTo4(inDegree / denominator),
      outDegreeCentrality: roundTo4(outDegree / denominator),
      totalDegreeCentrality: roundTo4((inDegree + outDegree) / (2 * denominator))
    }
  }

  delete state.currentFile
  delete state.dependencies

  state.status = true
}

export { state, visitors, postProcessing }
