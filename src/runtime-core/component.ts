import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
import { shallowReadonly } from '../reactivity/reactivity';
import { emit } from './componentEmit';
import { initSlots } from './componentSlots';
export function createComponentInstance(vnode, parent){
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent
  }
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent(instance){
  // 初始化 initProps initSlots
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any){
  const Component = instance.type

  // 创建代理对象，this.msg 可以直接访问，但是setup返回的是一个对象，它并不直接在this上
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)
  const { setup } = Component
  if(setup){
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    }) //setupResult 可能是 function或者 object
    setCurrentInstance(null)
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

let currentInstance = null

export function getCurrentInstance(){
  return currentInstance
}

export function setCurrentInstance(instance){
  currentInstance = instance
}