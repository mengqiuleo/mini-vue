import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly"
}

export function reactive(raw){
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw){
  // 因为只读，所以不需要 trigger，同样不需要 track
  return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(value){ //调用它的set来判断
  return !!value[ReactiveFlags.IS_REACTIVE] //转换成布尔值，如果是普通值，必然不会调用get，那么调用这个属性返回undefined，那直接把undefined转成Boolean
}

export function isReadonly(value){
  return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObject(raw: any, baseHandlers){
  return new Proxy(raw, baseHandlers)
}