import { getCurrentInstance } from './component';
export function provide(key, value){
  //存
  let currentInstance: any = getCurrentInstance()
  if(currentInstance){
    let { provides } = currentInstance 
    const parentProvide = currentInstance.parent.provides
    if(provides === parentProvide){
      provides = currentInstance.provides = Object.create(parentProvide)    
    }

    provides[key] = value
  }
}

export function inject(key, defaultValue){
  //取
  const currentInstance: any = getCurrentInstance()

  if(currentInstance){
    const parentProvides = currentInstance.parent.provides

    if(key in parentProvides){
      return parentProvides[key]
    } else if(defaultValue){
      if(typeof defaultValue === 'function'){
        return defaultValue()
      }
      return defaultValue
    }
  }
}