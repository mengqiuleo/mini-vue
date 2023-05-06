import { h } from '../../lib/guide-mini-vue.esm.js'
import ArrayToText from './ArrayToText.js'
import TextToText from './TextToText.js'
import TextToArray from './TextToArray.js'
import ArrayToArray from './ArrayToArray.js'

export const App = {
  render(){
    return h('div', {tId: 1}, [
      h('p', {}, '主页'),
      // h(ArrayToText) //测试该功能：在控制台输入 isChange.value = true
      // h(TextToText)
      // h(TextToArray)
      h(ArrayToArray)
    ])
  },

  setup(){
    return {
      msg: 'mini-vue'
    }
  }
}