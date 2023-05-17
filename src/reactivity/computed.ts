import { ReactiveEffect } from './effect'
/**
 * 关于 computed，我竟然有些不太懂
 * 接受一个 getter 函数，返回一个只读的响应式 ref 对象。
 * 该 ref 通过 .value 暴露 getter 函数的返回值。
 * 它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。
 * https://cn.vuejs.org/api/reactivity-core.html#computed
 */

/**
 * 关键点在于，当我们计算属性包裹的响应式的值发生改变时，computed如何监听到
 * effect 第一次执行的时候会执行 fn，不会执行 scheduler
 * 当响应式对象 set update 如果有scheduler, 此时不会执行 fn, 而是执行 scheduler
 */
class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true //值是否发生改变，true表示发生改变，初始化时也算一次改变
  private _value: any
  private _effect: ReactiveEffect
  constructor(getter){
    this._getter = getter
    this._effect = new ReactiveEffect(getter, () => { //传入scheduler，那么响应式的值更新时会执行 scheduler
      if(!this._dirty){ //如果以前标记值未发生改变，那么此时标记为值发生改变，那么下一次我们获取计算属性值时，就是执行effect的fn，那么此时就会触发get，走 Reflect.get
        this._dirty = true
      }
    })
  }

  get value(){
    if(this._dirty){ //初始化或者值发生改变
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter){
  return new ComputedRefImpl(getter)
}