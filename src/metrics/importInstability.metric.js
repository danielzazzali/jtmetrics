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
  name: 'Import Instability',
  description: 'Computes afferent and efferent coupling from file imports and derives instability I = Ce / (Ca + Ce)',
  result: {},
  id: 'import-instability',
  dependencies: ['file-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
  }
}

function postProcessing (state) {
  const fileCouplingGraph = buildCouplingGraph(state.dependencies['file-coupling'])

  for (const [filePath, coupling] of Object.entries(fileCouplingGraph)) {
    const afferent = coupling.fanIn.length
    const efferent = coupling.fanOut.length
    const instability = afferent + efferent === 0
      ? 0
      : roundTo4(efferent / (afferent + efferent))

    state.result[filePath] = {
      afferent,
      efferent,
      instability
    }
  }

  delete state.currentFile
  delete state.dependencies

  state.status = true
}

export { state, visitors, postProcessing }
