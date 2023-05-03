import { ReactiveEffect } from './effect'
/**
 * 关于 computed，我竟然有些不太懂
 * 接受一个 getter 函数，返回一个只读的响应式 ref 对象。
 * 该 ref 通过 .value 暴露 getter 函数的返回值。
 * 它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。
 * https://cn.vuejs.org/api/reactivity-core.html#computed
 */

class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: ReactiveEffect
  constructor(getter){
    this._getter = getter
    this._effect = new ReactiveEffect(getter, () => {
      if(!this._dirty){
        this._dirty = true
      }
    })
  }

  get value(){
    if(this._dirty){
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter){
  return new ComputedRefImpl(getter)
}