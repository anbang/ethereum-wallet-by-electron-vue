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

CSS样式都没有写，仅写简单的业务逻辑

- 主界面

    - 显示当前默认账号
    - 设置默认账号
    - 账号余额/总余额
    - 创建账号
        - 创建账号因为用 ganache-cli 做的模拟，目前没有做密钥导出备份
    - 导入账号
        - 导入后，仅仅读取了文件内信息，没有添加到账号列表；（web3没找到相关api；只找到Geth相关的import）


- 账号详情页
    - 当前账号
    - 当前账号的余额
    - 当前账号的交易信息

- 转账页面
    - 直接点Header区域的"转账"，默认使用"当前节点的默认账号"作为转出方（如果没有默认账号，使用账号列表的第一个作为转出方）
    - 如果从某个账号A的详情页点"发起转账"，进入的页面，默认使用A账号作为转出方
    - 转账成功后，交易信息的预览和本地存储；