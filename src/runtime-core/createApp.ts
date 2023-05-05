import { createVNode } from "./vnode"

export function createAppAPI(render){
  return function createApp(rootComponent){
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

