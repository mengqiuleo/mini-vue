const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}


// 创建一个 proxy对象，可以直接通过 this.$el 拿到属性
export const PublicInstanceProxyHandlers = {
  get({ _: instance}, key){
    const { setupState } = instance // setupState就是setup函数返回的对象
    if(key in setupState){
      return setupState[key]
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