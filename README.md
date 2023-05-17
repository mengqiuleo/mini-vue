yarn test 执行测试

yarn add babel-jest @babel/core @babel/preset-env --dev

yarn add --dev @babel/preset-typescript

## 测试单个测试用例
- yarn test reactive

  会自动匹配 reactive.spec.ts 文件

- yarn test effect --watch 可调试


## 打包 runtime-core
yarn build 

yarn build --watch 当文件发生变化后，自动打包


## jest 快照测试
yarn test codegen -u 更新快照内容