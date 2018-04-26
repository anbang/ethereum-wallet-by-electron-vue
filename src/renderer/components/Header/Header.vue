<template>
  <header class="header b-flex">
      <ul class="header-nav">
          <li><router-link to="/" class="active">{{ $t('model_header.home') }}</router-link></li>
          <li><router-link to="/transfer">{{ $t('model_header.transfer') }}</router-link></li>
          <li><router-link to="/contacts">{{ $t('model_header.contacts') }}</router-link></li>
          <li><router-link to="/setting">{{ $t('model_header.setting') }}</router-link></li>
      </ul>
      <div class="has-assets-czr">
          {{ $t('model_header.total') }}
          <strong>{{totalBalance}}</strong>
          {{ $t('unit.czr') }}
      </div>
  </header>

</template>

<script>
import web3 from "@/global/web3.js";
var fs = require('fs');  
var path = require('path');  

export default {
  name: "Header",
  data() {
    return {

    };
  },
  computed:{
    totalBalance:function(){
      var self=this;
      //根据文件路径读取文件，返回文件列表   
      var filePath = '/Users/broszhu/Library/Ethereum/keystore';
      var files=fs.readdirSync(filePath);

      //遍历读取到的文件列表 、账户列表  
      var fileAddress=[];//储存本地文件的地址
      files.forEach(function(filename){  
          //获取当前文件的绝对路径  
          var filedir = path.join(filePath,filename);  
          //根据文件路径获取文件信息，返回一个fs.Stats对象  
          var stats = fs.statSync(filedir)
          var isFile = stats.isFile();//是文件  
          // var isDir = stats.isDirectory();//是 文件夹  
          if(isFile){
            var tempFile=fs.readFileSync(filedir).toString();
            try {
                var tempAcc=JSON.parse(tempFile).address; 
                fileAddress.push(tempAcc)  
            } catch (err) {
              // console.log('err', err)
            }
          }
          // if(isDir){  
          //     fileDisplay(filedir);//递归， 如果是文件夹， 就继续遍历 该文件夹下面的文件  
          // }  
      });

      console.log("fileAddress ",fileAddress)
      for (var k=0;k<fileAddress.length;k++){
          var balance = web3.eth.getBalance(fileAddress[k]);
          temoObj={
            tag:"Account"+(k+1),
            address:fileAddress[k],
            balance: balance,
            tx_list:[]
          }

          //如果不存在某个地址添 加
          if (!self.$db.read().get("czr_accounts").filter({address:fileAddress[k]}).value().length) {
            self.$db
              .get("czr_accounts")
              .push(temoObj)
              .write();
          }

          //TODO   判断余额变化 更新对应 
          total += balance.toNumber();
      }

      //创建本地文件，并获取金额 
      var total = 0;
      var temoObj=null;
      var dbAddress=self.$db.read().get("czr_accounts").value();

      console.log("dbAddress:",dbAddress)

      for (var i=0;i<dbAddress.length;i++){
          var isExist=false;//address是否存在
          for (var j=0;j<fileAddress.length;j++){
              if(dbAddress[i].address==fileAddress[j]){
                  isExist=true;
                  break;
              }
          }

          //如果不存在，删除
          if(!isExist){
              self.$db.read().get("czr_accounts").remove({ address: dbAddress[i].address }).write()
          }
      }
          console.log(total)

      return web3.fromWei(total, "ether");
}
}
}

</script>

<style scoped>
.header {
  padding: 12px 20px;
  -webkit-user-select: none;
  /* background-color: #f4f4f4; */
}
.header-nav{width: 70%;text-align: left;}
.has-assets-czr{
    width: 30%;
    text-align: right;
    font-size: 16px;
}
.header-nav > li {
  display: inline-block;
  font-size: 16px;
  margin-right: 30px;
  color: #34495e;
}
.header-nav a{color: #34495e;text-decoration: none;display: inline-block;}
.header-nav a:hover{color: #2d2b5d;}
.header-nav a.router-link-exact-active{border-bottom: 3px solid #2d2b5d;}

</style>

