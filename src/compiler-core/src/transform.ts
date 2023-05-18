import { NodeType } from "./ast"
import { TO_DISPLAY_STRING } from './runtimeHelper'

export function transform(root, options = {}){
  const context = createTransformContext(root, options)

  //1.dfs
  //2.修改 text content
  traverseNode(root, context)

  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root){
  root.codegenNode = root.children[0]
}

function createTransformContext(root: any, options: any): any{
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key){
      context.helpers.set(key, 1)
    }
  }
  return context
}

function traverseNode(node: any, context: any){
  // console.log(node) //输出每次遍历的节点（深度优先搜索）
  // if(node.type === NodeType.TEXT){
  //   node.content = node.content + ' mini-vue'
  // }
  const nodeTransforms = context.nodeTransforms
  for(let i=0; i<nodeTransforms.length; i++){
    const transform = nodeTransforms[i]
    transform(node, context)
  }

  switch(node.type){
    case NodeType.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break
    case NodeType.ROOT:
    case NodeType.ELEMENT:
      traverseChildren(node, context)
      break
    default:
      break
  }

  // const children = node.children
  // if(children){
  //   for(let i=0; i<children.length; i++){
  //     const node = children[i]
  //     traverseNode(node, context)
  //   }
  // }
  //* 这里不理解，再看
  // traverseChildren(node, context) //这里是把递归的过程抽离出来了，我其实不是很喜欢，代码可读性降低
}

function traverseChildren(node:any, context: any){
  const children = node.children

    for(let i=0; i<children.length; i++){
      const node = children[i]
      traverseNode(node, context)
    }
  
}