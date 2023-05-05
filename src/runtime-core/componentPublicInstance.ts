import { hasOwn } from '../shared/index'
const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots
}


// 创建一个 proxy对象，可以直接通过 this.$el 拿到属性
export const PublicInstanceProxyHandlers = {
  get({ _: instance}, key){
    const { setupState, props } = instance // setupState就是setup函数返回的对象
    if(key in setupState){
      return setupState[key]
    }
    // const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)
    if(hasOwn(setupState, key)){
      return setupState[key]
    } else if(hasOwn(props, key)){
      return props[key]
    }
    // if(key === '$el'){
    //   return instance.vnode.el
    // }
    const publicGetter = publicPropertiesMap[key]
    if(publicGetter){
      return publicGetter(instance)
    }
  } 
}

