import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  render(){
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick() {
          console.log('click')
        },
        onmMousedown() {
          console.log('moused')
        }
      }, 
      // 'hello, ' + this.msg
      // 'hi, mini-vue' //string类型
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
      [
        h('div', {}, 'hi,' + this.msg), 
        h(Foo, {
          count: 1
        })
      ]
    )
  },

  setup(){
    return {
      msg: 'mini-vue'
    }
  }
}