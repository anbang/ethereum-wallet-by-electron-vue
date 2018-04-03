<template>
  <div class="hello">
     <p>
       从那个账号进来的：{{queryAcc || '直接进入的'}}
      </p> 
      <h2>默认的主账号：{{defaultAcc}}</h2>
    <h1>{{ msg }} Gas暂时使用默认</h1>
    <br><br>
    转出方：
    <select name="from_address" @change="onSelected">
      <option v-for="account in accounts" :value="account" v-if="account == queryAcc">{{account}}</option>
      <option v-for="account in accounts" :value="account" >{{account}}</option>
    </select>
    <span> {{thisAccBa}} Eth</span>

    <br><br>
    转入方：
    <input type="text" placeholder="请输入对方账号" class="tran_input" @blur="getToAddress">
    <br><br>
    金额：
    <input type="text" placeholder="请输入转账金额" class="tran_input" @blur="getTransVal" :value="transVal">
    <span> 账户余额：{{thisAccBa}} Eth</span>
    <br><br>
    
    Gas：
    <input type="text" placeholder="请输入转账金额" class="tran_input" :value="defaultGas" disabled @blur="getUserGas">
    <span>预估手续费 {{ defaultGas }}</span>
    <br><br>
    总额：<span> {{tranTotal}} </span>

      <br><br><br>
      <input type="button" value="确定转账" @click="submitTran">
      <br><br>
      <p>发送交易的交易哈希:{{txid}}</p>
      <div style="text-align: left;">
      <pre >{{txidInfo}}</pre>
      </div>

  </div>
</template>

<script>
import web3 from '@/global/web3.js'
import { throws } from 'assert';

export default {
  name: 'Search',
  data () {
    return {
      txid:"",//交易发送时候的TXID，需要储存
      txidInfo:"",//TXID查询的数据，需要储存
      tranTotal:"",//当前交易合计需要的ETH
      accounts:web3.eth.accounts,//当前账号列表
      fromAccount:web3.eth.accounts[0],//发送放的账号
      defaultAcc:web3.eth.defaultAccount,//默认的主账号

      queryAcc:this.$route.query.account,//当前路由带过来的账号信息

      toAccount:'',//接收方的地址
      transVal:0,//交易金额
      userGas:"",//Gas

      thisAccBa:web3.fromWei(web3.eth.getBalance(this.$route.query.account ||web3.eth.accounts[0]).toNumber(), 'ether'),//发送方的账户余额
      msg: '转账页面'
    }
  },
  computed:{
    accBalance:function(){
      var balaceWei = web3.eth.getBalance(this.currentAcc).toNumber();
      var balaceVal = web3.fromWei(balaceWei, 'ether')
      return balaceVal;
    },
    defaultGas:function(){
      // var result = web3.eth.estimateGas({
      //       to: "0x93fce2c3985BEB2Ab9DF590382141479Ff159759"
      // });
      // console.log(result,web3.eth.gasPrice.toNumber())
      // console.log(web3.fromWei(result, 'ether'));
      var GasVal=web3.eth.gasPrice.toNumber()*1000;
      this.userGas = web3.fromWei(GasVal, 'ether');
      return web3.fromWei(GasVal, 'ether');
    }
  },
  methods:{
    onSelected:function(ele) {
      var currentAdd=ele.target.value;
      this.fromAccount= currentAdd ; 
      this.thisAccBa = web3.fromWei(web3.eth.getBalance(currentAdd).toNumber(), 'ether') ;
      this.getTotal();
    },
    getToAddress:function(ele){
      var currentAdd=ele.target.value;
      this.toAccount= currentAdd ; 
      this.getTotal();
    },
    getTransVal:function(ele){
      var currentVal=ele.target.value;
      this.transVal= currentVal ; 
      this.getTotal();
    },
    getUserGas:function(ele){
      var currentVal=ele.target.value;
      console.log(currentVal)
      this.userGas= currentVal; 
      this.getTotal();
    },
    getTotal:function(){
      var transWeiVal= web3.toWei(this.transVal, 'ether');
      var userWeiGas= web3.toWei(this.userGas, 'ether');
      var TotalWei=parseInt(transWeiVal)+parseInt(userWeiGas);
      
      console.log(this.$route.query.account);
      this.tranTotal = web3.fromWei(TotalWei,'ether' ) ;
    },

    submitTran:function(){
      self=this;
      var options={
        "from":self.fromAccount,
        "to":self.toAccount,
        "value":web3.toWei(self.transVal,'ether' ),
        // "gas":web3.toWei(self.userGas,'ether'),
      }
    
    console.log(options);
      if(!self.toAccount){
        alert('请填写地址')
        return;
      }
      web3.eth.sendTransaction(options,function(err, address) {
          if (!err){
              var receipt=web3.eth.getTransactionReceipt(address);
              self.txid = address;
              self.txidInfo = receipt;

              console.log(address);//0x059b9238d7003416960db8d9f9d8de506f17574b37f03c9101c941a439fa942c
              console.log(receipt);
          }else{
            throw err;
          }
      });

      // 发送后向交易记录添加
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tran_input{width: 300px;}
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
</style>
