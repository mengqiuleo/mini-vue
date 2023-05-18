// 整个 mini-vue 的出口
export * from './runtime-dom'

import { baseCompile } from './compiler-core/src/compile'
import * as runtimeDom from './runtime-dom/index'
import { registerRuntimeCompiler } from './runtime-dom/index'

function compileToFunction(template) {
  const { code } = baseCompile(template)

  const render = new Function('Vue', code)(runtimeDom)

  return render
}

registerRuntimeCompiler(compileToFunction)