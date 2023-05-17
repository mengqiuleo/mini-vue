import { generate } from '../src/codegen';
import { baseParse } from '../src/parse';
import { transform } from '../src/transform';
import { transformExpression } from '../src/transforms/transformExpression';
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
})