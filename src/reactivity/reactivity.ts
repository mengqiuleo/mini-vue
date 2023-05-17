import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';
import { isObject } from '../shared/index';

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly"
}

export function reactive(raw){
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw){
  // 因为只读，所以不需要 trigger，同样不需要 track
  return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw){
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value){ //调用它的get来判断, 在get中我们会对这个特殊的key做单独的判断
  return !!value[ReactiveFlags.IS_REACTIVE] //转换成布尔值，如果是普通值，必然不会调用get，那么调用这个属性返回undefined，那直接把undefined转成Boolean
}

export function isReadonly(value){
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value){
  return isReactive(value) || isReadonly(value)
}

function createReactiveObject(target: any, baseHandlers){
  if(!isObject(target)){
    console.warn(`target ${target} 必须是一个对象`)
  }
  return new Proxy(target, baseHandlers)
}