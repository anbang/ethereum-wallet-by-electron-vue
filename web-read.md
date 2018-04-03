### 可能需要的web3

web3.isAddress(item.value)      //检查给定的字符串是否是有效的Ethereum地址。它还将检查校验和，如果地址有大写和小写字母。
web3.toChecksumAddress(address) //将大写或小写的Ethereum地址转换为校验和地址。

web3.reset(true);               //用来重置web3的状态,参数可以控制 web3.eth.isSyncing()

web3.admin
web3.(string, options)          //返回值： 使用Keccak-256 SHA3算法哈希过的结果。
    String - 传入的需要使用Keccak-256 SHA3算法进行哈希运算的字符串。
    Object - 可选项设置。如果要解析的是hex格式的十六进制字符串。需要设置encoding为hex,因为JS中会默认忽略0x,如：{encoding: 'hex'}


web3.isConnected()                  //检查到节点的连接是否存在
web3.currentProvider)               //当前所链接节点的属性
    {
    host: 'http://localhost:8545',
    timeout: 0,
    user: undefined,
    password: undefined 
    }


Web3.providers.HttpProvider("http://localhost:8545")        //基于HTTP从Web3.providers链接节点

web3.net.getPeerCount           //异步获取  节点连上的其它以太坊节点的数量(对象是当前所连接的节点)

web3.fromWei(value, 'ether'))
web3.toWei(formValues.dailyLimitAmount, 'ether')


### eth

web3.eth.getSyncing     // web3.eth.syncing //正在sync的情况返回同步对象,（startingBlock、currentBlock、highestBlock），否则false；

web3.eth.getBlock       //获取区块对象(通过区块号或区块哈希值)

### 交易的

web3.eth.getBalance     //获得余额(指定区块下指定地址的,余额是BigNumber实例，单位为wei,区块不传,用defaultBlock设置的)
web3.eth.estimateGas    //模拟打包费 （获取一个模拟的call/transcation花费gas）
web3.eth.sendTransaction    //发送一个交易对象到网络,返回32字节的16进制格式的交易哈希串,
                            //如果交易是一个合约创建，请使用web3.eth.getTransactionReceipt()在交易完成后获取合约的地址。
web3.eth.getTransaction         //获取交易对象（通过交易哈希值的）
web3.eth.getTransactionReceipt // 获取一个交易的收据对象（通过交易的哈希）,处于pending状态的交易，收据是不可用的。

web3.eth.filter('latest')       ////过滤对象,用来做事件监听的
web3.eth.accounts[0];           //返回当前节点持有的帐户列表
web3.eth.getStorageAt           //获得存储的状态值	(某个地址指定位置的)。
web3.eth.isSyncing              //同步开始，更新，停止的回调函数方法；


### 合约的

web3.eth.contract                       //创建一个Solidity的合约对象，用来在某个地址上初始化合约,一个合约对象
web3.eth.contract(abiArray).at(address) //通过ABI和地址获取已部署的合约对象
web3.eth.getCode                        //获取合约编译后的字节代码 (指定地址)
web3.eth.compile.solidity       //web3编译源码的方式  编译Solidity源代码





