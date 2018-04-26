<template>
    <div class="page-czr-home">
        <div class="home-banner">
            <i class="iconfont icon-logo">&#xe650;</i>
            <div>
                <button class="bui-button">导入账号</button>
                <button class="bui-button" @click="openFolder">备份账号</button>
            </div>
        </div>
        <div class="home-content">
            <div class="account-wrap b-flex">
                <template v-for="account in localAccounts">
                    <router-link :to="'/account/' + account.address" tag="div" class="accounrt-item ">
                        <div class="account-avatar">
                          <i class="iconfont ico-avatar">&#xe602;</i>
                        </div>
                        <i class="iconfont delete-acc">&#xe613;</i>
                        <div class="account-cont">
                            <p class="account-remark">{{account.tag}}</p>
                            <h1 class="account-assets">{{account.balance | ShortVal}}</h1>
                            <p class="account-unit">CZR</p>
                            <p class="account-address">{{account.address}}</p>
                        </div>  
                    </router-link>
              </template>
                <!--  ADD  -->
                <div class="accounrt-item add-account" @click="addPwdDiaVisible = true">
                    <div class="account-cont">
                      <i class="iconfont icon-add-acc">&#xe63b;</i>
                      <p class="add-acc-des">新建账号</p>
                    </div>  
                </div>
            </div>
        </div>




        <h1 class="demo-hist">{{ msg }} </h1>

        <h2>挖矿成功奖励的地址: {{mainAcc}}</h2>
        <br>


        <br><br>
        <form action="">
            <div>
                <label for="">创建 账 号</label>
                <input v-model="password" type="password">
                <input type="button" value="Create" @click='createAcc'>
            </div>
            <div>
                <div>账号信息</div>
                <div>private key:<label id="private"></label></div>
                <div>public key:<label id="public"></label></div>
                <div>address:<label id="address"></label></div>
                <div>balance:<label id="balance">0</label></div>
            </div>

        </form>
        <br>
        <br>
        <br>
        <input type="file" id='userImport' enctype="multipart/form-data">
        <input type="button" value="import Account" @click="addPwdDiaVisible = true">

<br><br>
<p>导入的账户信息：</p>
        <p> {{importInfo}}</p>
        <br> <br>



<el-dialog
  title="提示"
  :visible.sync="addPwdDiaVisible"
  width="60%">
  <span>
    <p>输入一个强密码（ 至少9位 ）</p>
<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
  <el-form-item label="密码" prop="pass">
    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
  </el-form-item>
</el-form>

  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addPwdDiaVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAccount">确 定</el-button>
  </span>
</el-dialog>

    </div>

</template>

<script>
// import web3 form '@'
import web3 from "@/global/web3.js";
const path = require("path");

//备份文件
const shell = require('electron').shell
import { remote, app } from 'electron'// 引入remote模块，使其既能跑在main进程也能跑在renderer进程：
const APP = process.type === 'renderer' ? remote.app : app;// 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath('userData')// 获取electron应用的用户目录
console.log("PATH",STORE_PATH)


const fs = require("fs");

export default {
  name: "Bodyer",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if(value.length<9){
          callback(new Error('至少9位'));
        }
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      addPwdDiaVisible:false,
      ruleForm2: {
          pass: '',
          checkPass: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },




      msg: "欢迎来到CZR钱包的主界面 ",
      password: "",
      importInfo: "",
      newAccountInfo: {
        privateKey: "",
        publicKey: "",
        address: "",
        balance: "",
        keyFile: ""
      },
      defaultAcc: web3.eth.defaultAccount,
      mainAcc: web3.eth.coinbase,
      accounts2: [],
      accounts: web3.eth.accounts
    };
  },
  filters: {
    ShortVal: function (value) {
      if (!value) return ''
      value = Number(value)
      return value.toFixed(2)
    }
  },
  computed: {
    addressBalance: function(address) {
      var balance = web3.eth.getBalance(address);
      return web3.fromWei(balance, "ether");
    },
    localAccounts:function(){
      var tempAcc=this.$db.read().get('czr_accounts').value();
      for(var i=0;i<tempAcc.length;i++){
        var current=web3.eth.getBalance(tempAcc[i]["address"]);
        //如果最新的余额和本地数据库不同，更新数据；
        if(current!=tempAcc[i]["balance"]){
          this.$db.read().get('czr_accounts').find({'address': tempAcc[i]["address"]}).assign({'balance':current}).write()
        }
        //转成用户金额 
        tempAcc[i]["balance"]= web3.fromWei(tempAcc[i]["balance"], "ether");
      }
      return tempAcc;
    }
  },
  methods: {
    // 备份账号
    openFolder:function(){
      shell.showItemInFolder(STORE_PATH+'/accounts');
      // shell.openExternal('https://github.com'); 
    },

    //addAccount
    addAccount:function(){
      console.log('22 2',web3)
      var self=this;
      if((this.ruleForm2.checkPass>=9)&&(this.ruleForm2.pass>=9)&&(this.ruleForm2.pass==this.ruleForm2.checkPass)){
          console.log('000')
          web3.personal.newAccount(this.ruleForm2.checkPass, function(e, res){
              console.log(e, res)//0x2b765eba6de2da0b39365367215f93e563291f49
              var temoObj={
                  tag:"Account Name",
                  address:res,
                  balance:"0",
                  tx_list:[]
                }
              self.$db
              .get("czr_accounts")
              .push(temoObj)
              .write();
          });


          this.addPwdDiaVisible=false;
          //TODO 页面更新新建的账号
      }
    },


    createAcc: function() {
      // alert("create")
      var account_three = web3.personal.newAccount(this.password);
      // web3.shh.generateSymKeyFromPassword()
      console.log(account_three,web3.shh.generateSymKeyFromPassword(this.password));
      //账号的公钥 私钥 地址'
      // this.newAccountInfo.address=account_three
      // this.newAccountInfo.publicKey=web3.shh.getPublicKey(account_three)
      // this.newAccountInfo.privateKey=web3.shh.getPublicKey(account_three)
      // this.newAccountInfo.balance=web3.eth.getBalance(account_three);
      // this.newAccountInfo.keyFile=web3.shh.getPublicKey()

      this.accounts = web3.eth.accounts;
      alert("OK,创建完成" + account_three);
    },
    importAcc: function() {
      // web3.personal.importRawKey('0xff3d7ee787cE86641264920Baadff8DaaB735A2a')
      //{name: "UTC--2017-11-28T11-59-01.358663700Z--93fce2c3985beb2ab9df590382141479ff159759", path: "/Users/broszhu/Downloads/西溪地址/UTC--2017-11-28T11-5…663700Z--93fce2c3985beb2ab9df590382141479ff159759", lastModified: 1522665488000, lastModifiedDate: Mon Apr 02 2018 18:38:08 GMT+0800 (CST), webkitRelativePath: ""…}
      var userImport = document.getElementById("userImport").files[0];
      var userImportPath = userImport.path;
      console.log(userImport, userImportPath);
      var self = this;

      var newPath = path.resolve(
        userImportPath,
        "../import/" + userImport.name
      );
      //                var newPath=path.resolve(userImportPath, '../import/');
      console.log(newPath);
      var self = this;
      fs.readFile(userImportPath, "utf8", function(err, data) {
        // 读取文件失败/错误
        if (err) {
          throw err;
        }
        // 读取文件成功
        var accountInfo = data.toString();
        var newAccount = JSON.parse(accountInfo).address; //TODO 如果地址存在就不写入了；
        console.log("Start Address", newAccount, web3.isAddress(newAccount));

        if (web3.isAddress(newAccount)) {
          newAccount = "0x" + newAccount.replace("0x", "").toLowerCase();
        }

        self.importInfo = accountInfo;
        console.log("utf-8: ", accountInfo, newAccount);

        //                    console.log(userImportPath+"./test");

        // 写入本地

        //personal.importRawKey(key,password)
        //                    web3.personal.importRawKey(newAccount)

        //                    console.log('导入OK');
        self.accounts = web3.eth.accounts;
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-czr-home {}
.home-banner {
  width: 100%;
  height: 175px;
  background-image: linear-gradient(
    45deg,
    #2d2b5d 0%,
    #4d4d8f 50%,
    #5a59a0 100%
  );
}
.home-banner .icon-logo{color: #fff;font-size: 80px;}

/* account */
.account-wrap{
  /* padding-top: 64px; */
  margin-top: 40px;
  /* width: 100%; */
  /* background: #1E8FAA; */
  padding: 0 20px;
  margin-left: -20px;
  flex-wrap:wrap;
}
.accounrt-item {
    width: 218px;
    border: 1px transparent;
    padding: 44px 10px 10px 10px;
    position: relative;
    margin: 40px 0 20px 20px;
    background-color: #fff;
    cursor: pointer;
    -webkit-user-select: none;
}
.accounrt-item.add-account{
  border: 1px dashed #dddddd;
  padding-top: 24px;
  padding-bottom: 30px;
  /* background: linear-gradient(white,white) padding-box,
    repeating-linear-gradient(-45deg,#ccc 0, #ccc 2px ,white 0,white 8px); */
}
.accounrt-item .account-assets{
    font-size: 24px;
    color: #2d2b5d;
}
/* .accounrt-item .account-avatar{
  position: absolute;
  top: -32px;
  left: 88px;
  width: 64px;
  height: 64px;
  border-radius:50%;
  text-align: center; 
  background-color: #1E8FAA ;
} */
.accounrt-item .account-avatar {
    position: absolute;
    top: -16px;
    left: 86px;
    width: 64px;
    height: 40px;
    background: #4d4d8f;
}
.accounrt-item .account-avatar:before {
    content: "";
    position: absolute;
    top: -16px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 32px solid transparent;
    border-right: 32px solid transparent;
    border-bottom: 16px solid #4d4d8f;
}
.accounrt-item .account-avatar:after {
    content: "";
    position: absolute;
    bottom: -16px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 32px solid transparent;
    border-right: 32px solid transparent;
    border-top: 16px solid #4d4d8f;
}


.accounrt-item .account-avatar .ico-avatar{
  color: #fff;
  font-size: 34px;
  margin-top: -5px;
}
.accounrt-item .delete-acc{
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    color: rgb(204, 204, 204);
}
.accounrt-item .delete-acc:hover{
  color: #2d2b5d;
}
.accounrt-item .account-address{
    max-width: 220px;
    margin-top: 12px;
    color: #9A9C9D;
    table-layout:fixed; 
    word-break: break-all; 
    overflow:hidden;
}
.accounrt-item .account-cont{
  margin-top: 10px;
}
.accounrt-item .icon-add-acc{
  font-size: 48px;
  color: #9A9C9D ;
}
.accounrt-item .add-acc-des{color: #9A9C9D ;}

.demo-hist{margin-top: 200px;}
</style>
