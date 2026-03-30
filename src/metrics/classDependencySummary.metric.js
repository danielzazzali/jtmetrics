function sumValues (obj) {
  return Object.values(obj).reduce((acc, value) => acc + value, 0)
}

function sumNestedValues (nestedObj) {
  return Object.values(nestedObj).reduce((acc, inner) => acc + sumValues(inner), 0)
}

const state = {
  name: 'Class Dependency Summary',
  description: 'Aggregates fan-in and fan-out dependency totals for each class across its methods',
  result: {},
  id: 'class-dependency-summary',
  dependencies: ['class-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}

    const classCouplingResult = state.dependencies['class-coupling'][state.currentFile] || {}

    for (const [className, methods] of Object.entries(classCouplingResult)) {
      let fanInCalls = 0
      let fanOutCalls = 0
      const fanInClasses = new Set()
      const fanOutClasses = new Set()

      for (const methodNode of methods) {
        const fanInMap = methodNode['fan-in'] || {}
        const fanOutMap = methodNode['fan-out'] || {}

        fanInCalls += sumNestedValues(fanInMap)
        fanOutCalls += sumNestedValues(fanOutMap)

        for (const classId of Object.keys(fanInMap)) fanInClasses.add(classId)
        for (const classId of Object.keys(fanOutMap)) fanOutClasses.add(classId)
      }

      state.result[state.currentFile][className] = {
        methods: methods.length,
        fanInCalls,
        fanOutCalls,
        fanInClasses: fanInClasses.size,
        fanOutClasses: fanOutClasses.size,
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
