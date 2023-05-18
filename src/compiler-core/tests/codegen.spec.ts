import { generate } from '../src/codegen';
import { baseParse } from '../src/parse';
import { transform } from '../src/transform';
import { transformExpression } from '../src/transforms/transformExpression';
import { transformElement } from '../src/transforms/transformElement';
describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi')

    transform(ast)
    const { code } = generate(ast)

    expect(code).toMatchInlineSnapshot(`
"
return function render(_ctx, _cache){return 'hi'}"
`)//快照测试
  })

  it('string', () => {
    const ast = baseParse('{{message}}')

    transform(ast, {
      nodeTransforms: [transformExpression]
    })
    const { code } = generate(ast)

    expect(code).toMatchInlineSnapshot(`
"const { toDisplayString:_toDisplayString } = Vue
return function render(_ctx, _cache){return _toDisplayString(_ctx.message)}"
`)//快照测试
  })

  it.only('element', () => {
    const ast = baseParse('<div></div>')

    transform(ast, {
      nodeTransforms: [transformElement]
    })
    const { code } = generate(ast)

    expect(code).toMatchInlineSnapshot(`
"const { createElementVNode:_createElementVNode } = Vue
return function render(_ctx, _cache){return _createElementVNode('div')}"
`)//快照测试
  })
})

