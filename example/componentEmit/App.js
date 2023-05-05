import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  render(){
    return h(
      'div',
      {}, 
      // 'hello, ' + this.msg
      // 'hi, mini-vue' //string类型
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
      [ h('div', {}, 'app'), h(Foo, {
        onAdd(a,b){
          console.log(a,b)
          console.log('onAdd')
        },
        onAddFoo(a,b){
          console.log('onAddFoo', a,b)
        }
      }) ]
    )
  },

  setup(){
    return {
      msg: 'mini-vue'
    }
  }
}