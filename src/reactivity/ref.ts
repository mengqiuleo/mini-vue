import { trackEffects, triggerEffects, isTracking } from './effect';
import { hasChanged, isObject } from '../shared/index';
import { reactive } from './reactivity';
class RefImpl {
  private _value: any
  public dep
  private _rawValue: any
  public __v_isRef = true
  constructor(value){
    this._rawValue = value
    this._value = convert(value)
    //1.看看value是不是对象 

    this.dep = new Set()
  }

  get value(){
    trackRefValue(this)
    return this._value
  }

  set value(newValue){
    //如果新值和旧值相等
    // if(Object.is(newValue, this._value)) return
    //对上面这行代码优化，抽离函数
    //对比的时候，如果ref里面是对象，那么新值是一个普通object，老值是一个proxy,所以最迟我们需要保存老值
    if(hasChanged(newValue, this._rawValue)){
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}

function convert(value){
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref){
  if(isTracking()){
    trackEffects(ref.dep)
  }
}

export function ref(value){
  return new RefImpl(value)
}

export function isRef(ref){
  return !!ref.__v_isRef //对于普通值，调用属性没有值，为undefined，转成布尔值
}

export function unRef(ref){
  //看看是不是ref，如果是，返回value，不是直接返回它的值
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs){
  //如果是ref对象，返回它的value，否则直接返回
  return new Proxy(objectWithRefs, {
    get(target, key){
      return unRef(Reflect.get(target, key))
    },

    set(target, key, value){
      //对应的值是普通值，更改，是ref，替换
      if(isRef(target[key]) && !isRef(value)){ //是普通值
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}