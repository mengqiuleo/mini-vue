import {ref, h } from '../../lib/guide-mini-vue.esm.js'

//1.左侧对比
// (a b) c
// (a b) d e
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'E' }, 'E')
// ]


//2.右侧对比
// a ( b c )
// d e ( b c)
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]

// const nextChildren = [
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'E' }, 'E'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

//3.新的比老的长 创建新的
// 左侧
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B')
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'D' }, 'D'),
// ]

// 右侧
// (a b)
// d c (a b)
// i = 0, e1 = -1, e2 = 0
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B')
// ]

// const nextChildren = [
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]


//4.老的比新的长 删除
//左侧
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B')
// ]

//右侧
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]

// const nextChildren = [
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

//5.对比中间的部分
// 删除老的
// a b (c d) f g
// a b (e c) f g
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C', id: 'c-prev' }, 'C'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'F' }, 'F'),
//   h('p', { key: 'G' }, 'G')
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'E' }, 'E'),
//   h('p', { key: 'C', id: 'c-next' }, 'C'),
//   h('p', { key: 'F' }, 'F'),
//   h('p', { key: 'G' }, 'G')
// ]

// 乱序：移动
//a b (c d e) f g
//a b (e c d) f g
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'E' }, 'E'),
//   h('p', { key: 'F' }, 'F'),
//   h('p', { key: 'G' }, 'G')
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'E' }, 'E'),
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'F' }, 'F'),
//   h('p', { key: 'G' }, 'G')
// ]

//综合
// a b (c d e z) f g
// a b (d c y e) f g
const prevChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'C' }, 'C'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'E' }, 'E'),
  h('p', { key: 'Z' }, 'Z'),
  h('p', { key: 'F' }, 'F'),
  h('p', { key: 'G' }, 'G')
]

const nextChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'C' }, 'C'),
  h('p', { key: 'Y' }, 'Y'),
  h('p', { key: 'E' }, 'E'),
  h('p', { key: 'F' }, 'F'),
  h('p', { key: 'G' }, 'G')
]

export default {
  name: 'ArrayToArray',
  setup(){
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange
    }
  },
  render(){
    const self = this
    return self.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  }
}