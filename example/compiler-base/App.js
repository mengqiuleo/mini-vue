import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  template: `<div>hi, {{ message }}</div>`,
  setup(){
    return {
      msg: 'mini-vue'
    }
  }
}