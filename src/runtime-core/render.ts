import { createComponentInstance, setupComponent } from "./component"
import { EMPTY_OBJ, isObject } from '../shared/index'
import { ShapeFlags } from "../shared/ShapeFlags"
import { Fragment, Text } from "./vnode"
import { createAppAPI } from './createApp';
import { effect } from '../reactivity/effect';

export function createRenderer(options){
  const { createElement, patchProp, insert,remove, setElementText } = options


  function render(vnode, container){
    patch(null,vnode, container,null, null)
  }

  //n1: 老的
  function patch(n1, n2, container, parentComponent, anchor){
    //* ShapeFlags
    const { type, shapeFlag } = n2
    // 处理 element 或者 component

    switch(type){
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){ //typeof vnode.type === 'string'
          processElement(n1, n2, container, parentComponent, anchor)
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){ //isObject(vnode.type)
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break;
    }
  }

  function processFragment(n1, n2: any, container: any, parentComponent: any, anchor){
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processText(n1, n2: any, container: any){
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement(n1, n2: any, container: any, parentComponent: any, anchor){
    if(!n1){
      mountElement(n2, container,parentComponent, anchor)
    } else {
      patchElement(n1,n2, container, parentComponent, anchor)
    }
  }

  function mountElement(vnode: any, container:any, parentComponent: any, anchor){
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
      mountChildren(vnode.children, el, parentComponent, anchor)
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
    insert(el, container, anchor)
  }

  function mountChildren(children, container, parentComponent, anchor){
    children.forEach(v => {
      patch(null, v, container, parentComponent, anchor)
    });
  }

  function processComponent(n1, n2:any, container: any, parentComponent: any, anchor){
      mountComponent(n2, container, parentComponent, anchor) //挂载组件
  }

  function patchElement(n1, n2, container, parentComponent, anchor){
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchChildren(n1,n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1, n2, container, parentComponent, anchor){
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
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function isSomeVNodeType(n1, n2){
    return n1.type === n2.type && n1.key === n2.key
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor){
    let i = 0, e1 = c1.length - 1, e2 = c2.length - 1

    //左侧
    while(i <= e1 && i <= e2){
      const n1 = c1[i]
      const n2 = c2[i]
      if(isSomeVNodeType(n1,n2)){
        patch(n1,n2,container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }

    //右侧
    while(i <= e1 && i <= e2){
      const n1 = c1[e1]
      const n2 = c2[e2]
      if(isSomeVNodeType(n1, n2)){
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }

    if(i > e1){   //新的比老的多 左右侧都适用
      if(i <= e2){
        const nextPos = e2 + 1
        const anchor = e2 + 1 < c2.length ? c2[nextPos].el : null 
        while(i <= e2){
          patch(null, c2[i], container, parentComponent, anchor) //这里是创建 
          i++
        }
      }
    } else if(i > e2){ //删除
      while(i <= e1){
        remove(c1[i].el)
        i++
      }
    } else { //乱序
      
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

  function mountComponent(initialVNode: any, container: any, parentComponent: any, anchor){
    //创建instance组件实例
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance,initialVNode, container, anchor)
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any, anchor){
    effect(() => {
      if(!instance.isMounted){
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
    
        patch(null, subTree, container, instance, anchor)
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else { //更新
        console.log('update')
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree

        instance.subTree = subTree
        patch(prevSubTree,subTree, container, instance, anchor)
      }

    })

  }

  return {
    createApp:  createAppAPI(render)
  }
}