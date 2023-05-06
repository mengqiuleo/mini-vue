import { createComponentInstance, setupComponent } from "./component"
import { EMPTY_OBJ, isObject } from '../shared/index'
import { ShapeFlags } from "../shared/ShapeFlags"
import { Fragment, Text } from "./vnode"
import { createAppAPI } from './createApp';
import { effect } from '../reactivity/effect';

export function createRenderer(options){
  const { createElement, patchProp, insert,remove, setElementText } = options


  function render(vnode, container){
    patch(null,vnode, container, null)
  }

  //n1: 老的
  function patch(n1, n2, container, parentComponent){
    //* ShapeFlags
    const { type, shapeFlag } = n2
    // 处理 element 或者 component

    switch(type){
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){ //typeof vnode.type === 'string'
          processElement(n1, n2, container, parentComponent)
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){ //isObject(vnode.type)
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
  }

  function processFragment(n1, n2: any, container: any, parentComponent: any){
    mountChildren(n2.children, container, parentComponent)
  }

  function processText(n1, n2: any, container: any){
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement(n1, n2: any, container: any, parentComponent: any){
    if(!n1){
      mountElement(n2, container,parentComponent)
    } else {
      patchElement(n1,n2, container, parentComponent)
    }
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
      mountChildren(vnode.children, el, parentComponent)
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
      patchProp(el, key,null, val)

    }

    // container.append(el)
    insert(el, container)
  }

  function mountChildren(children, container, parentComponent){
    children.forEach(v => {
      patch(null, v, container, parentComponent)
    });
  }

  function processComponent(n1, n2:any, container: any, parentComponent: any){
    if(!n1){
      mountComponent(n2, container, parentComponent) //挂载组件
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function patchElement(n1, n2, container, parentComponent){
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchChildren(n1,n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1, n2, container, parentComponent){
    const prevShapeFlag = n1.shapeFlag
    const { shapeFlag } = n2
    const c2 = n2.children
    const c1 = n1.children

    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
      if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
        //1.把老的children清空
        unmountChildren(n1.children)
        //2.设置 text
        setElementText(container, c2)
      } else {
        if(c1 !== c2){
          setElementText(container, c2)
        }
      }
    } else {
      if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
        setElementText(container, '')
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren(children){
    for(let i=0; i<children.length; i++){
      const el = children[i].el
      remove(el)
    }
  }

  function patchProps(el, oldProps, newProps){
    if(oldProps !== newProps){
      for(const key in newProps){
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
  
        if(prevProp !== nextProp){
          patchProp(el, key, prevProp, nextProp)
        }
      }
  
      if(oldProps !== EMPTY_OBJ){
        for(const key in oldProps){
          if(!(key in newProps)){
            patchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function mountComponent(initialVNode: any, container: any, parentComponent: any){
    //创建instance组件实例
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance,initialVNode, container)
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any){
    effect(() => {
      if(!instance.isMounted){
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
    
        patch(null, subTree, container, instance)
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else { //更新
        console.log('update')
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree

        instance.subTree = subTree
        patch(prevSubTree,subTree, container, instance)
      }

    })

  }

  return {
    createApp:  createAppAPI(render)
  }
}