### 使用

- electron   (跨平台、使用版本V8.4.0)
- vue       （路由/SPA）
- webpack   （构建）
- node/npm
- lowdb     (本地存储)

# 依赖

需要Geth，我用的是 ganache-cli 来模拟测试的；

https://github.com/trufflesuite/ganache-cli

启动步骤

> geth --syncmode "fast" --rpc --rpccorsdomain "http://localhost:9080" --rpcapi personal,web3,eth,net


``` bash
# install dependencies
-  npm install -g ganache-cli

# 命令行输入下面命令，并且保持运行状态；
-  ganache-cli

```


#### Build Setup

``` bash
# cd
cd eth-wallet-demo

# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

#### 进度