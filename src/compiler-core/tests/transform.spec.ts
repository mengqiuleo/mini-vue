import { NodeType } from '../src/ast';
import { baseParse } from '../src/parse';
import { transform } from '../src/transform';
describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse('<div>hi,{{message}}</div>')
    const plugin = (node: any) => {
      if(node.type === NodeType.TEXT){
        node.content = node.content + ' mini-vue'
      }
    }
    transform(ast, {
      nodeTransform: [plugin]
    })

    const nodeText = ast.children[0].children[0]
    console.log('transform.spec: ', nodeText)
    expect(nodeText.content).toBe('hi, mini-vue')
  })
})