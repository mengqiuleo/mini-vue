import { mutableHandlers, readonlyHandlers } from './baseHandlers';


export function reactive(raw){
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw){
  // 因为只读，所以不需要 trigger，同样不需要 track
  return createActiveObject(raw, readonlyHandlers)
}

function createActiveObject(raw: any, baseHandlers){
  return new Proxy(raw, baseHandlers)
}