import { NodeType } from "../ast";
import { CREATE_ELEMENT_VNODE } from '../runtimeHelper'

export function transformElement(node, context) {
  if(node.type === NodeType.ELEMENT){
    context.helper(CREATE_ELEMENT_VNODE)
  }
}