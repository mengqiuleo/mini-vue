import { createComponentInstance, setupComponent } from "./component"
import { isObject } from '../shared/index'
import { ShapeFlags } from "../shared/ShapeFlags"
import { Fragment, Text } from "./vnode"
import { createAppAPI } from './createApp';

export function createRenderer(options){
  const { createElement, patchProp, insert } = options


  function render(vnode, container){
    patch(vnode, container, null)
  }

  function patch(vnode, container, parentComponent){
    //* ShapeFlags
    const { type, shapeFlag } = vnode
    // 处理 element 或者 component

    switch(type){
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;
      case Text:
        processText(vnode, container)
        break;
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){ //typeof vnode.type === 'string'
          processElement(vnode, container, parentComponent)
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){ //isObject(vnode.type)
          processComponent(vnode, container, parentComponent)
        }
        break;
    }
  }

  function processFragment(vnode: any, container: any, parentComponent: any){
    mountChildren(vnode, container, parentComponent)
  }

  function processText(vnode: any, container: any){
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement(vnode: any, container: any, parentComponent: any){
    mountElement(vnode, container,parentComponent)
  }

  function mountElement(vnode: any, container:any, parentComponent: any){
    // const el = document.createElement('div') //vnode.type
    // el.textContent = 'hi mini-vue' //vnode.children children 分为string 或者array
    // el.setAttribute('id', 'root') //vnode.props
    // document.body.append(el)

    const el = (vnode.el = createElement(vnode.type))

    // string array -> children
    const { children, shapeFlag } = vnode
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){ //typeof children === 'string'
      el.textContent = children
    } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){ //Array.isArray(children)
      // children.forEach(v => {
      //   patch(v, el)
      // })
      mountChildren(vnode, el, parentComponent)
    }

    //props
    const { props } = vnode
    for(const key in props){
      const val = props[key]
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if(isOn(key)){
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      patchProp(el, key,val)

    }

    // container.append(el)
    insert(el, container)
  }

  function mountChildren(vnode, container, parentComponent){
    vnode.children.forEach(v => {
      patch(v, container, parentComponent)
    });
  }

  function processComponent(vnode:any, container: any, parentComponent: any){
    mountComponent(vnode, container, parentComponent) //挂载组件
  }

  function mountComponent(initialVNode: any, container: any, parentComponent: any){
    //创建instance组件实例
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance,initialVNode, container)
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any){
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    patch(subTree, container, instance)
    initialVNode.el = subTree.el
  }

  return {
    createApp:  createAppAPI(render)
  }
}