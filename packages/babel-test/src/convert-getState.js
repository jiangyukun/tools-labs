const t = require('@babel/types')

const fs = require('fs')
const {traverseAndSelect, convertCodeUseAst} = require('./utils')

module.exports = function (dir, match) {
  traverseAndSelect(dir)(match)((filePath, namespace) => {
    convertFile(filePath, namespace)
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
                if (node.callee.type == 'MemberExpression') {
                  const {object, property} = node.callee
                  if (object.type == 'ThisExpression' && property.name == 'getState') {
                    callPath.replaceWith(t.yieldExpression(t.callExpression(t.identifier('select'), [])))
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
