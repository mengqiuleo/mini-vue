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
/**
 * runtime-core 不具备编译模板的功能，所以这里我们全部写成 compiler-sfc 编译好的模板
 * 关于 创建虚拟节点：是在 runtime-core 中实现的，而模板编译后后的 东西也有体现，这里的 h函数相当于一个字符串，只是展示，
 * 真正使用是在 runtime-core 中
 * compiler-sfc 相当于是把模板编译成字符串，里面的函数都只是字符串，但是当它执行时。里面的函数才会变成真正的函数
 */