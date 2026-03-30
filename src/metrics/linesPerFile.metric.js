import fs from 'fs'

const state = {
  name: 'Lines Per File',
  description: 'Counts total and non-empty lines for each analyzed source file',
  result: {},
  id: 'lines-per-file',
  dependencies: ['files'],
  status: false
}

function splitLines (source) {
  if (!source || source.length === 0) return []
  const lines = source.split(/\r?\n/)
  if (lines[lines.length - 1] === '') lines.pop()
  return lines
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result = state.dependencies.files

    let source = ''
    try {
      source = fs.readFileSync(state.currentFile, 'utf-8')
    } catch {
      state.result[state.currentFile] = {
        total: 0,
        nonEmpty: 0,
        blank: 0
      }
      return
    }

    const lines = splitLines(source)
    const nonEmpty = lines.filter(line => line.trim() !== '').length

    state.result[state.currentFile] = {
      total: lines.length,
      nonEmpty,
      blank: lines.length - nonEmpty
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

export { state, visitors, postProcessing }
