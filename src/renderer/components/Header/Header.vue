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

export default {
  name: "Header",
  data() {
    return {
      accounts: web3.personal.listAccounts
    };
  },
  computed:{
    totalBalance:function(){
      var total = 0;
      var temoObj=null;
      for (var i = 0; i < this.accounts.length; i++) {
        var balance = web3.eth.getBalance(this.accounts[i]);
        temoObj={
          tag:"账号"+(i+1),
          address:this.accounts[i],
          balance: balance,
          tx_list:[]
        }
        //如果不存在某个地址 添加
        if (!this.$db.read().get("czr_accounts").filter({address:this.accounts[i]}).value().length) {
          this.$db
            .get("czr_accounts")
            .push(temoObj)
            .write();
        }

        //TODO 判断余额变化，更新对应

        total += balance.toNumber();
    }
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

