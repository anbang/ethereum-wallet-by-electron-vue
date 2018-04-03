<template>
  <div class="hello">
    <h1>当前账号{{ currentAcc }} 

      <router-link :to="'/transfer?account=' + currentAcc">发起转账</router-link>  
      <!-- <a href="#">发起转账</a> -->
      
    </h1>
    <h2>余额：{{accBalance}} Eth</h2>
    <br>
    <br>
    <h4>交易记录</h4>
    <ul>
      <li>
        <div style="text-align: left;">
          <pre >{{transIds}}</pre>
        </div>
      </li>
    </ul>

    <!-- <p>{{balaceVal}}</p> -->

  </div>
</template>

<script>
import web3 from '@/global/web3.js'
import { futimes } from 'fs';

export default {
  name: 'Account',
  data () {
    return {
      msg: '账号',
      currentAcc:this.$route.params.id,
      balaceVal:web3.eth.getBalance(this.$route.params.id).toNumber()
    }
  },
  computed:{
    accBalance:function(){
      var balaceWei = web3.eth.getBalance(this.currentAcc).toNumber();
      var balaceVal = web3.fromWei(balaceWei, 'ether')
      return balaceVal;
    },
    transIds:function(){
        
        var tx_list = this.$db.read().get('czr_accounts.'+this.currentAcc+'.tx_list').value();

        console.log(this.$db.read().get('czr_accounts.'+this.currentAcc).value())

        //0x059b9238d7003416960db8d9f9d8de506f17574b37f03c9101c941a439fa942c
        //0xffd52aab6437ba8ad2947f5745d1ab6f03c92f3bc1dd61f23ccb8ad28133c2f6
        return tx_list;
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
</style>
