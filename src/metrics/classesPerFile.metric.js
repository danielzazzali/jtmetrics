/** @type {import('../types.js').MetricState} */
const state = {
  name: 'Classes Per File',
  description: 'Analyzes each source file to identify and record all top-level classes defined',
  result: {},
  id: 'classes-per-file',
  dependencies: ['files'],
  status: false
}

/** @type {import('../types.js').MetricVisitors} */
const visitors = {
  // Entry point for each parsed file, load dependency
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = state.dependencies.files[state.currentFile]
  },

  ClassDeclaration (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       class Calculator {}
       class AdvancedCalculator extends Calculator {}

       parentPath.node.type === 'Program' -> Consider only file block class declarations
       Ignore: (() => { <Class_declaration_here> })();
    */
    if (node.id &&
      node.id.name &&
      parentPath.node.type === 'Program' ||
      parentPath.node.type === 'ExportNamedDeclaration'
    ) {
      /* Ignore:
         class SuperCalculator extends class{} {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const className = node.id.name
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
             innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })

      return
    }

    /* Examples:
       export default class {}
       export default class Foo{}
    */
    if (parentPath.node.type === 'ExportDefaultDeclaration') {
      // Classes with default export will be referenced by the name of the file
      const className = path.node.id
        ? path.node.id.name
        : state.currentFile.split('/').pop().replace(/\.(js|ts)$/, '')

      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })
    }
  },

  ClassExpression (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       const Logger = class {}
    */
    if (parentPath.node.type === 'VariableDeclarator' &&
      parentPath.node.id &&
      parentPath.node.id.name
    ) {
      /* Ignore:
         (() => { <Class_expression_here> })();
      */
      if (parentPath.find(p => p.isCallExpression())) {
        return
      }

      /* Ignore:
         class SuperCalculator extends class {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const className = parentPath.node.id.name
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })

      return
    }

    /* Examples:
       { ['LiteralClassName']: class {} }
    */
    if (parentPath.node.type === 'ObjectProperty' &&
      parentPath.node.key &&
      parentPath.node.key.type === 'StringLiteral'
    ) {
      const className = parentPath.node.key.value
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })

      return
    }

    /* Examples:
       { Printer: class {} }
    */
    if (parentPath.node.type === 'ObjectProperty' &&
      parentPath.node.key &&
      parentPath.node.key.type === 'Identifier' &&
      parentPath.node.computed === false
    ) {
      const className = parentPath.node.key.name
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })
    }
  }
}

/** @param {import('../types.js').MetricState} state */
function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

export { state, visitors, postProcessing }
