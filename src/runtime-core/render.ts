import { createComponentInstance, setupComponent } from "./component"
import { EMPTY_OBJ, isObject } from '../shared/index'
import { ShapeFlags } from "../shared/ShapeFlags"
import { Fragment, Text } from "./vnode"
import { createAppAPI } from './createApp';
import { effect } from '../reactivity/effect';
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { queueJobs } from "./scheduler";

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
      // 在 runtime-dom 中
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if(isOn(key)){
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      patchProp(el, key,null, val)

    }

    //* 往页面上插入真实节点 container.append(el)
    insert(el, container, anchor)
  }

  function mountChildren(children, container, parentComponent, anchor){
    children.forEach(v => {
      patch(null, v, container, parentComponent, anchor)
    });
  }

  function processComponent(n1, n2:any, container: any, parentComponent: any, anchor){
    if(!n1){
      mountComponent(n2, container, parentComponent, anchor) //挂载组件
    } else {
      updateComponent(n1, n2)
    }
  }

  function updateComponent(n1, n2){
    const instance = (n2.component = n1.component)
    if(shouldUpdateComponent(n1, n2)){ //是否需要更新
      instance.next = n2
      instance.update() //调用它的effect函数，在 setupRenderEffect 中设置
    } else {
      n2.el = n1.el
      instance.vnode = n2
    }

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
        //* array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function isSomeVNodeType(n1, n2){
    return n1.type === n2.type && n1.key === n2.key
  }

  //* diff
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
      let s1 = i, s2 = i
      const toBePatched = e2 - s2 + 1
      let patched = 0

      const keyToNewIndexMap = new Map()
      const newIndexToOldIndexMap = new Array(toBePatched)
      let moved = false
      let maxNewIndexSofar = 0
      for(let i=0; i<toBePatched; i++) newIndexToOldIndexMap[i] = 0

      for(let i=s2; i<=e2; i++){
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      for(let i=s1; i<=e1; i++){
        const prevChild = c1[i]

        if(patched >= toBePatched){
          remove(prevChild.el)
          continue;
        }

        let newIndex
        if(prevChild.key !== null){
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for(let j=s2; j<=e2; j++){
            if(isSomeVNodeType(prevChild, c2[j])){
              newIndex = j
              break;
            }
          }
        }

        if(newIndex === undefined){
          remove(prevChild.el)
        } else {
          if(newIndex >= maxNewIndexSofar){
            maxNewIndexSofar = newIndex
          } else {
            moved = true
          }

          newIndexToOldIndexMap[newIndex - s2] = i + 1

          patch(prevChild,c2[newIndex],container, parentComponent, null)
          patched++
        }
      }

      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1
      for(let i=toBePatched-1; i>=0; i--){
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null

        if(newIndexToOldIndexMap[i] === 0){ //0在这里有特殊意义
          patch(null, nextChild, container, parentComponent, anchor)
        }
        else if(moved){
          if(j<0 || i !== increasingNewIndexSequence[j]){
            console.log('移动位置')
            insert(nextChild.el,container, anchor)
          } else {
            j--
          }
        }
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

  function mountComponent(initialVNode: any, container: any, parentComponent: any, anchor){
    //创建instance组件实例
    const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent))

    setupComponent(instance) //初始化 initProps initSlots
    setupRenderEffect(instance,initialVNode, container, anchor)
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any, anchor){
    instance.update = effect(() => {
      if(!instance.isMounted){
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        // 当这里的 subTree 为元素时，我终于明白了里面的props，children是哪来的，
        //当时我们执行 instance.render = Component.render，然后执行const subTree = instance.render()
        // 注意，这里是执行render函数，而render函数里面返回 h函数 的执行结果，可以去看下 h函数，它其实是传入了三个参数的，正好对应 type,props,children
    
        patch(null, subTree, container, instance, anchor)
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else { //* 更新
        console.log('update')
        const { next, vnode } = instance
        if(next){
          next.el = vnode.el
          updateComponentPreRender(instance, next)
        }
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree

        instance.subTree = subTree
        patch(prevSubTree,subTree, container, instance, anchor)
      }

    }, 
    {
      scheduler(){
        console.log('update-scheduler')
        queueJobs(instance.update)
      }
    })

  }

  return {
    createApp:  createAppAPI(render)
  }
}

function updateComponentPreRender(instance, nextVNode){
  instance.vnode = nextVNode
  instance.next = null
  instance.props = nextVNode.props
}

function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
