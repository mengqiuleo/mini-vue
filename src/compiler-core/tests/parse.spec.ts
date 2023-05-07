import { NodeType } from '../src/ast'
import { baseParse } from '../src/parse'

describe('Parse', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast = baseParse('{{message}}')

      expect(ast.children[0]).toStrictEqual({
        type: NodeType.INTERPOLATION,
        content: {
          type: NodeType.SIMPLE_EXPRESSION,
          content: 'message'
        }
      })
    })
  }),

  describe('element', () => {
    it('simple element div', () => {
      const ast = baseParse('<div></div>')
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: 'div',
        children: []
      })
    })
  }),

  describe('text', () => {
    it('simple text', () => {
      const ast = baseParse('some text')
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.TEXT,
        content: 'some text'
      })
    })
  }),

  test('hello world', () => {
    const ast = baseParse('<div>hi, {{message}}</div>')
    expect(ast.children[0]).toStrictEqual({
      type: NodeType.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeType.TEXT,
          content: 'hi, '
        },
        {
          type: NodeType.INTERPOLATION,
          content: {
            type: NodeType.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    })
  }),

  test('Nested element', () => {
    const ast = baseParse('<div><p>hi</p>{{message}}</div>')
    expect(ast.children[0]).toStrictEqual({
      type: NodeType.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeType.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NodeType.TEXT,
              content: 'hi',
            }
          ]
        },
        {
          type: NodeType.INTERPOLATION,
          content: {
            type: NodeType.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    })
  }),

  test('should throw error when lack end tag', () => {
    expect(() => {
      baseParse('<div><span></div>')
    }).toThrow('缺少结束标签:span')
  })
})