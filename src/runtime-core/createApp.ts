import { createVNode } from "./vnode"

// createApp 接收一个带有各种元素信息的参数，返回一个对象，然后调用这个对象的mount方法
export function createAppAPI(render){
  return function createApp(rootComponent){ // root Component 元素信息
    return {
      mount(rootContainer){ //rootContainer 是挂载组件的地方。比如根app
        //先转换成虚拟节点 component -> vnode
        //所有的逻辑操作都会基于 vnode 做处理
        const vnode = createVNode(rootComponent)
  
        render(vnode, rootContainer)
      }
    }
  }
  
}

