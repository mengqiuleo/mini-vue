import { extend } from "../shared"

class ReactiveEffect{ //* 一种封装的思想
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  constructor(fn, public scheduler?){
    this._fn = fn
    this.scheduler = scheduler
  }

  run(){
    activeEffect = this
    return this._fn()
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

  if(!activeEffect) return

  dep.add(activeEffect) //将当前的更新函数保存，如何拿到当前effect中的fn, 利用全局变量
  activeEffect.deps.push(dep)
}


export function trigger(target, key){
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for(const effect of dep){ //每一个effect都是一个 class类实例
    if(effect.scheduler){
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}


let activeEffect
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