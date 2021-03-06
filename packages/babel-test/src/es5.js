const t = require('@babel/types')
const template = require('@babel/template').default
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

const code = `let a: A<any>[] = 1`

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
  tokens: true
})

traverse(ast, {
  Program(path) {
    let node = path.node
  }
})

console.log(generator(ast, {retainFunctionParens: true, retainLines: true, concise: true}).code)
