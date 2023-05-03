import { extend } from "../shared"

let activeEffect
let shouldTrack

export class ReactiveEffect{ //* 一种封装的思想
  private _fn: any
  deps = []
  active = true //控制stop是否已经清理过, true表示还没clean
  onStop?: () => void
  constructor(fn, public scheduler?){
    this._fn = fn
    this.scheduler = scheduler
  }

  run(){
    activeEffect = this
    if(!this.active){ //false:已经clean过了，以后不用追踪
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    shouldTrack = false
    return result
  }

  stop(){
    //m频繁调用 stop 时，如果清空过了，就不用再清空了
    if(this.active){
      cleanupEffect(this)
      if(this.onStop){
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect){
  effect.deps.forEach((dep: any) => { //dep代表某个key的所有effect，是一个set
    dep.delete(effect) //让每一个set删除当前effect
  })
  effect.deps.length = 0
}

const targetMap = new Map() //所有对象，映射
export function track(target, key){
  // if(!activeEffect) return
  // if(!shouldTrack) return
  //对上面代码优化
  if(!isTracking()) return

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

  trackEffects(dep)
}

export function trackEffects(dep){
  //如果activeEffect已经在dep中了，不用再加了
  if(!dep.has(activeEffect)){
    dep.add(activeEffect) //将当前的更新函数保存，如何拿到当前effect中的fn, 利用全局变量
    activeEffect.deps.push(dep)
  }
}

export function isTracking(){
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key){
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  triggerEffects(dep)
}

export function triggerEffects(dep){
  for(const effect of dep){ //每一个effect都是一个 class类实例
    if(effect.scheduler){
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options:any = {}){
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)
  // _effect.onStop = options.onStop
  // 将上面这行代码进行优化
  // Object.assign(_effect, options)
  //再次进行优化，抽离一个公共函数
  extend(_effect, options)
 
  _effect.run()

  const runner: any =  _effect.run.bind(_effect) // 返回的那个runner函数
  runner.effect = _effect
  return runner
}

export function stop(runner){
  runner.effect.stop()
}