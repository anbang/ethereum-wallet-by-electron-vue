<template>
    <div class="page-czr-home">
        <h1>{{ msg }} </h1>
        <br>

        <h2>默认主账号: {{defaultAcc}}</h2>
        <h2>挖矿成功奖励的地址: {{mainAcc}}</h2>
        <h2>所有账户的总额：{{totalBalance}} Eth</h2>
        <br>
        <p>账号列表</p>
        <ul v-for="account in accounts2">
            <li>
                <router-link :to="'/account/' + account.address">{{account.address}}</router-link>
                <span> 余额 {{account.balance}} ETH</span>

                <a href="javascript:;" @click="setDefaule(account.address)">设为主账号</a>
                <span>|</span>
                <router-link :to="'/account/' + account.address">账户详情</router-link>
            </li>
        </ul>


        <br><br>
        <form action="">
            <div>
                <label for="">创建账号</label>
                <input v-model="password" type="password">
                <input type="button" value="Create" @click='createAcc'>
            </div>
        </form>
        <br>
        <br>
        <br>
        <input type="file" id='userImport' enctype="multipart/form-data">
        <input type="button" value="import Account" @click='importAcc'>

<br><br>
<p>导入的账户信息：</p>
        <p> {{importInfo}}</p>
        <br> <br>

    </div>

</template>

<script>
    // import web3 form '@'
    import web3 from '@/global/web3.js';
    const path = require('path');


    const fs = require('fs')


    export default {
        name: 'Bodyer',
        data() {
            return {
                msg: '欢迎来到CZR钱包的主界面 ',
                password: "",
                importInfo:"",
                defaultAcc:web3.eth.defaultAccount,
                mainAcc: web3.eth.coinbase,
                accounts2:[],
                accounts: web3.personal.listAccounts
            }
        },
        computed: {
            test: function () {
                return [1, 2, 3, 4, 5]
            },
            totalBalance:function(){
                var total=0;
                var self=this;
                self.accounts2=[];
                for(var i=0;i<this.accounts.length;i++){
                    var balance = web3.eth.getBalance(this.accounts[i]);
                    // console.log(balance)
                    self.accounts2.push({
                        address:this.accounts[i],
                        balance:web3.fromWei(balance.toNumber(),"ether")
                    })
                    total+=balance.toNumber();
                }
                console.log(self.accounts2)
                return web3.fromWei(total,"ether");
            },
            addressBalance:function(address){
                var balance = web3.eth.getBalance(address);
                return web3.fromWei(balance,"ether");
            }
        },
        methods: {
            setDefaule:function(address){
                this.defaultAcc = web3.eth.defaultAccount = address;//
            },
            createAcc: function () {
                // alert("create")
                var account_three = web3.personal.newAccount(this.password);
                console.log(account_three);
                this.accounts = web3.personal.listAccounts;
                alert('OK,创建完成'+account_three)
            },
            importAcc: function () {
                // web3.personal.importRawKey('0xff3d7ee787cE86641264920Baadff8DaaB735A2a')
                //{name: "UTC--2017-11-28T11-59-01.358663700Z--93fce2c3985beb2ab9df590382141479ff159759", path: "/Users/broszhu/Downloads/西溪地址/UTC--2017-11-28T11-5…663700Z--93fce2c3985beb2ab9df590382141479ff159759", lastModified: 1522665488000, lastModifiedDate: Mon Apr 02 2018 18:38:08 GMT+0800 (CST), webkitRelativePath: ""…}
                var userImport = document.getElementById("userImport").files[0];
                var userImportPath = userImport.path;
                console.log(userImport,userImportPath);
                var self=this;

                var newPath=path.resolve(userImportPath, '../import/'+userImport.name);
//                var newPath=path.resolve(userImportPath, '../import/');
                console.log(newPath);
                var self=this;
                fs.readFile(userImportPath, "utf8", function (err, data) {
                    // 读取文件失败/错误
                    if (err) {
                        throw err;
                    }
                    // 读取文件成功
                    var accountInfo = data.toString();
                    var newAccount=JSON.parse(accountInfo).address;//TODO 如果地址存在就不写入了；
                    console.log('Start Address',newAccount,web3.isAddress(newAccount))

                    if(web3.isAddress(newAccount)){
                        newAccount =  '0x'+ newAccount.replace('0x','').toLowerCase();
                    }

                    self.importInfo = accountInfo;
                    console.log('utf-8: ', accountInfo, newAccount);
                    
//                    console.log(userImportPath+"./test");

                    // 写入本地

                    //personal.importRawKey(key,password)
//                    web3.personal.importRawKey(newAccount)

//                    console.log('导入OK');
                    self.accounts = web3.personal.listAccounts;

                });


//                fs.copyFile(userImportPath, newPath, (err) => {
//                    if (err) throw err;
//                    console.log('The file has been copyed!');
//                });

                // 同步读取
                // var data = fs.readFileSync(userImportPath,"utf-8");
                // console.log("同步读取: " + data.toString());
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .page-czr-home {
        padding: 20px;
        text-align: left;
    }
</style>
