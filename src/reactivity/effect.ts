class ReactiveEffect{ //* 一种封装的思想
  private _fn: any

  constructor(fn){
    this._fn = fn
  }

  run(){
    activeEffect = this
    this._fn()
  }
}

const targetMap = new Map() //所有对象，映射
export function track(target, key){
  // 每一个 target 的每一个属性都要存，容器 Set
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if(!depsMap){
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key) //dep: 对应的多个更新函数， 一个属性牵连着多个更新函数
  if(!dep){
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect) //将当前的更新函数保存，如何拿到当前effect中的fn, 利用全局变量
}


export function trigger(target, key){
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for(const effect of dep){ //每一个effect都是一个 class类实例
    effect.run()
  }
}


let activeEffect
export function effect(fn){
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}