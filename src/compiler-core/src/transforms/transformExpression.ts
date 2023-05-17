import { NodeType } from "../ast";

export function transformExpression(node){
  if(node.type === NodeType.INTERPOLATION){
    const rawContent = node.content.content
    node.content.content = '_ctx.' + rawContent
  }
}