import { PublicInstanceProxyHandlers } from './componentPublicInstance';
export function createComponentInstance(vnode){
  const component = {
    vnode,
    type: vnode.type
  }
  return component
}

export function setupComponent(instance){
  // 初始化 initProps initSlots

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any){
  const Component = instance.type

  // 创建代理对象，this.msg 可以直接访问，但是setup返回的是一个对象，它并不直接在this上
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)
  const { setup } = Component
  if(setup){
    const setupResult = setup() //setupResult 可能是 function或者 object

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance,setupResult: any){
  if(typeof setupResult === 'object'){
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any){
  const Component = instance.type

  if(Component.render){
    instance.render = Component.render
  }
}