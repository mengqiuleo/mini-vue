import { createComponentInstance, setupComponent } from "./component"
import { isObject } from '../shared/index'
import { ShapeFlags } from "../shared/ShapeFlags"

export function render(vnode, container){
  patch(vnode, container)
}

function patch(vnode, container){
  //* ShapeFlags
  const { shapeFlag } = vnode
  // 处理 element 或者 component
  if(shapeFlag & ShapeFlags.ELEMENT){ //typeof vnode.type === 'string'
    processElement(vnode, container)
  } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){ //isObject(vnode.type)
    processComponent(vnode, container)
  }

}

function processElement(vnode: any, container: any){
  mountElement(vnode, container)
}

function mountElement(vnode: any, container:any){
  // const el = document.createElement('div') //vnode.type
  // el.textContent = 'hi mini-vue' //vnode.children children 分为string 或者array
  // el.setAttribute('id', 'root') //vnode.props
  // document.body.append(el)

  const el = (vnode.el = document.createElement(vnode.type))

  // string array -> children
  const { children, shapeFlag } = vnode
  if(shapeFlag & ShapeFlags.TEXT_CHILDREN){ //typeof children === 'string'
    el.textContent = children
  } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){ //Array.isArray(children)
    // children.forEach(v => {
    //   patch(v, el)
    // })
    mountChildren(vnode, el)
  }

  //props
  const { props } = vnode
  for(const key in props){
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren(vnode, container){
  vnode.children.forEach(v => {
    patch(v, container)
  });
}

function processComponent(vnode:any, container: any){
  mountComponent(vnode, container) //挂载组件
}

function mountComponent(initialVNode: any, container: any){
  //创建instance组件实例
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance)
  setupRenderEffect(instance,initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode: any, container: any){
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  patch(subTree, container)
  initialVNode.el = subTree.el
}
