import { NodeType, createVNodeCall } from "../ast";

export function transformElement(node, context) {
  if(node.type === NodeType.ELEMENT){
    return () => {

      //中间处理层
      const vnodeTag = `'${node.tag}'`
      let vnodeProps
      const children = node.children
      let vnodeChildren = children[0]

      node.codegenNode = createVNodeCall(context, vnodeTag, vnodeProps, vnodeChildren)
    }
  }
}