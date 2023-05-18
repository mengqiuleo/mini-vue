import { ShapeFlags } from "../shared/ShapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export {
  createVNode as createElementVNode
}

interface VNode {
  /* HTML 标签名、组件、异步组件或函数式组件。使用返回 null 的函数将渲染一个注释。此参数是必需的。 */
  type: string | object | Function
  /* 一个对象，与我们将在模板中使用的 attribute、prop 和事件相对应。可选。 */
  props: object
  /* 子代 VNode，使用 h 生成，或者使用字符串来获取“文本 VNode”，或带有插槽的对象。可选。 */
  children: string | Array<VNode> | object
}

export function createVNode(type, props?, children?){
  const vnode = {
    type,
    props,
    children,
    next: null,
    component: null,
    key: props && props.key,
    shapeFlag: getShapeFlag(type),
    el: null
  }

  //children
  if(typeof children === 'string'){
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
  } else if(Array.isArray(children)){
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
    if(typeof children === 'object'){
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
    }
  }
  return vnode
}

export function createTextVNode(text: string){
  return createVNode(Text, {}, text)
}

function getShapeFlag(type){
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}