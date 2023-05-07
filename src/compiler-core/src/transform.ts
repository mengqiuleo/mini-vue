import { NodeType } from "./ast"

export function transform(root, options){
  const context = createTransformContext(root, options)

  //1.dfs
  //2.修改 text content
  traverseNode(root, context)
}

function createTransformContext(root: any, options: any): any{
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || []
  }
}

function traverseNode(node: any, context: any){
  console.log(node) //输出每次遍历的节点（深度优先搜索）
  // if(node.type === NodeType.TEXT){
  //   node.content = node.content + ' mini-vue'
  // }
  const nodeTransforms = context.nodeTransforms
  for(let i=0; i<nodeTransforms.length; i++){
    const transform = nodeTransforms[i]
    transform(node)
  }

  const children = node.children
  if(children){
    for(let i=0; i<children.length; i++){
      const node = children[i]
      traverseNode(node, context)
    }
  }
}