// https://template-explorer.vuejs.org/#eyJzcmMiOiJoaSIsIm9wdGlvbnMiOnt9fQ==

import { NodeType } from "./ast"
import { CREATE_ELEMENT_VNODE, TO_DISPLAY_STRING, helperMapName } from './runtimeHelper';
import { isString } from '../../shared/index';

export function generate(ast){
  const context = createCodegenContext()
  const { push } = context

  //处理导入函数
  const VueBinging = 'Vue'
  const aliasHelper = (s) => `${helperMapName[s]}:_${helperMapName[s]}`
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
    case NodeType.ELEMENT:
      genElement(node, context)
      break
    case NodeType.COMPOUND_EXPRESSION:
      genCompoundExpression(node,context)
      break
    default:
      break
  }
}

function genCompoundExpression(node, context){
  const { push } = context
  const children = node.children 
  for(let i=0; i<children.length; i++){
    const child = children[i]
    if(isString(child)){
      push(child)
    } else {
      genNode(child, context)
    }
  }
}

function createCodegenContext(){
  const context = {
    code: '',
    push(source){
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  }
  return context
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}

function genExpression(node: any, context: any) {
  const { push } = context
  push(`${node.content}`)
}

function  genElement(node:any, context: any) {
  const { push, helper } = context
  const { tag, children, props } = node
  push(`${helper(CREATE_ELEMENT_VNODE)}(`)
  genNodeList(genNullable([tag, props, children]), context)
  // genNode(children, context)
  push(')')
}

function genNodeList(nodes: any, context) {
  const { push } = context 
  for(let i=0; i<nodes.length; i++){
    const node = nodes[i]
    if(isString(node)){
      push(node)
    } else {
      genNode(node, context)
    }

    if(i < nodes.length - 1){
      push(', ')
    }
  }

}

function genNullable(args: any) {
  return args.map((arg) => arg || 'null')
}