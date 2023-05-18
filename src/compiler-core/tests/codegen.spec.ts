import { generate } from '../src/codegen';
import { baseParse } from '../src/parse';
import { transform } from '../src/transform';
import { transformExpression } from '../src/transforms/transformExpression';
import { transformElement } from '../src/transforms/transformElement';
import { transformText } from '../src/transforms/transformText';
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

  it('expression', () => {
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

//   it('element', () => {
//     const ast = baseParse('<div></div>')

//     transform(ast, {
//       nodeTransforms: [transformElement]
//     })
//     const { code } = generate(ast)

//     expect(code).toMatchInlineSnapshot(`
// "const { createElementVNode:_createElementVNode } = Vue
// return function render(_ctx, _cache){return _createElementVNode('div')}"
// `)//快照测试
//   })

  it('element+string', () => {
    const ast = baseParse('<div>hi, {{message}}</div>')

    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText]
    })
    const { code } = generate(ast)

    expect(code).toMatchInlineSnapshot(`
"const { toDisplayString:_toDisplayString, createElementVNode:_createElementVNode } = Vue
return function render(_ctx, _cache){return _createElementVNode('div', null, 'hi, ' + _toDisplayString(_ctx.message))}"
`)//快照测试
  })
})

/*
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, "hi, " + _toDisplayString(_ctx.message), 1))
}
 */