import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json';
// import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    // 打包出两个模块规范：cjs, esm
    {
      format: 'cjs',
      file: 'lib/guide-mini-vue.cjs.js'
    },
    {
      format: 'es',
      file: 'lib/guide-mini-vue.esm.js'
    }
  ],

  plugins: [
    json(),
    typescript(),
  ]
}