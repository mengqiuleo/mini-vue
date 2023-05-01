import { track, trigger } from "./effect"

export function reactive(raw){
  return new Proxy(raw, {
    get(target, key){ //对于get，在取值操作之前，我们需要实现依赖收集
      const res = Reflect.get(target, key)

      //* 依赖收集
      track(target, key)
      return res
    },

    set(target, key, value){
      const res = Reflect.set(target, key, value)

      //* 触发依赖，执行对应的effect函数
      trigger(target, key)
      return res
    }
  })
}