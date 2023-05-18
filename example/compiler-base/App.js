import { ref } from '../../lib/guide-mini-vue.esm.js'  


export const App = {
  name: 'App',
  template: `<div>hi, {{count}}</div>`,
  // template: `<button>click</button>`,
  setup(){
    const count = window.count =  ref(1)
    const onClick = () => {
      count.value++
    }
    return {
      message: 'mini-vue',
      count
    }
  }
}