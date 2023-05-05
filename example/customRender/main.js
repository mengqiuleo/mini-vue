import { createRenderer } from '../../lib/guide-mini-vue.esm.js'
import { App } from './App.js'

const renderer = createRenderer({
  createElement(type){
  
  },
  patchProp(el, key, val){
  
  },
  insert(el, parent){
  
  }
})

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)