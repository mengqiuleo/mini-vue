// https://template-explorer.vuejs.org/#eyJzcmMiOiJoaSIsIm9wdGlvbnMiOnt9fQ==

import { NodeType } from "./ast"

export function generate(ast){
  const context = createCodegenContext()
  const { push } = context

  //处理导入函数
  const VueBinging = 'Vue'
  const aliasHelper = (s) => `${s}:_${s}`
  if(ast.helpers.length > 0){
    push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`)
  }
  push('\n')

  // 处理返回函数
  push('return ')
  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')

  push(`function ${functionName}(${signature}){`)

  push('return ')

  genNode(ast.codegenNode,context)

  push('}')

  return {
    code: context.code
  }
}

function genNode(node:any, context){
  const { push } = context

  switch(node.type){
    case NodeType.TEXT:
      push(`'${node.content}'`)
      break
    case NodeType.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeType.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    default:
      break
  }
}

function createCodegenContext(){
  const context = {
    code: '',
    push(source){
      context.code += source
    }
  }
  return context
}

function genInterpolation(node: any, context: any) {
  const { push } = context
  push(`_toDisplayString(`)
  genNode(node.content, context)
  push(')')
}

function genExpression(node: any, context: any) {
  const { push } = context
  push(`${node.content}`)
}
