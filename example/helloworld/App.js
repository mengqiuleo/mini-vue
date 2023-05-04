import { h } from '../../lib/guide-mini-vue.esm.js'

window.self = null
export const App = {
  render(){
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard']
      }, 
      'hello, ' + this.msg
      // 'hi, mini-vue' //string类型
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
    )
  },

  setup(){
    return {
      msg: 'mini-vue'
    }
  }
}