import { toHandlerKey, camelize } from "../shared/index"

export function emit(instance, event, ...args){
  const { props } = instance

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)
}