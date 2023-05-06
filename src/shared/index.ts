export const extend = Object.assign

export const EMPTY_OBJ = {}

export const isObject = val => {
  return val !== null && typeof val === 'object'
}

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue)
}

export function hasOwn(val, key) {
  return Object.prototype.hasOwnProperty.call(val, key);
}

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : ''
  })
}
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}