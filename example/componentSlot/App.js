import { h, createTextVNode } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  render(){
    const app = h('div', {}, 'App')
    const foo = h(Foo, {}, 
      {
        header: ({age}) => [
          h('p', {}, 'header' + age),
          createTextVNode('mini-vue')
        ],
        footer: () => [h('p', {}, 'footer1'), h('p', {}, 'footer2')]
      })
    // const foo = h(Foo, {}, h('p', {}, '456'))
    return h('div',{}, [app, foo])
  },

  setup(){
    return {
      msg: 'mini-vue'
    }
  }
}