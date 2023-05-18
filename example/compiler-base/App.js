import { ref } from '../../lib/guide-mini-vue.esm.js'  

export const App = {
  name: 'App',
  template: `<div>hi, {{message}}</div>`,
  setup(){
    const count = window.count =  ref(1)
    return {
      message: 'mini-vue'
    }
  }
}