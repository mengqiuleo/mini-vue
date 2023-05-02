import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactivity"

const get = createGetter()
const set = createSetter() //保证初始化的时候调用一次，后序都不在调用
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false){
  return function get(target, key){
    if(key === ReactiveFlags.IS_REACTIVE){
      return !isReadonly
    } else if(key === ReactiveFlags.IS_READONLY){
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if(!isReadonly){
      track(target, key) //* 依赖收集
    }
    return res
  }
}

function createSetter(){
  return function set(target, key, value){
    const res = Reflect.set(target, key, value)

    //* 触发依赖，执行对应的effect函数
    trigger(target, key)
    return res
  }
}


export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value){
    console.warn(`key:${key} set 失败 因为 target 是 readonly`)
    return true
  }
}