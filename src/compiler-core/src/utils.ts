import { NodeType } from "./ast";

export function isText(node) {
  return node.type === NodeType.INTERPOLATION || node.type === NodeType.TEXT;
}
