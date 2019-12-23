const fs = require('fs')
const template = require('@babel/template').default
const {traverseAndSelect, convertCodeUseAst} = require('./utils')

module.exports = function (dir, match, callback) {
  traverseAndSelect(dir)(match)((filePath, namespace) => {
    convertFile(filePath, namespace, callback)
  })
}

function convertFile(code, namespace, filePath) {
  return convertCodeUseAst(code, {
    Program(rootPath) {
      rootPath.traverse({
        ObjectProperty(objectPath) {
          let keyName = objectPath.node.key.name
          if (keyName === 'effects') {
            objectPath.traverse({
              CallExpression(callPath) {
                const node = callPath.node
                if (node.callee.name == 'select') {
                  if (node.arguments.length == 0) {
                    node.arguments.push(
                      template.expression(`state => state[${namespace}]`)()
                    )
                  }
                }
              }
            })
          }
        }
      })
    }
  })
}
