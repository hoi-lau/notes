---
title: set proxy
publish: false
---

```sh
yarn config set proxy http://127.0.0.1:7890
yarn config set https-proxy http://127.0.0.1:7890

yarn config delete proxy
yarn config delete https-proxy

npm config set proxy=http://127.0.0.1:7890
npm config set https-proxy=http://127.0.0.1:7890
npm config set registry=http://registry.npmjs.org
npm config set registry https://npm.taobao.org/mirrors/node
npm config delete proxy
npm config delete https-proxy
```