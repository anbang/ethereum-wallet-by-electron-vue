<template>
  <div class="page-transfer">
    <div class="transfer-cont">
            <form class="bui-form" name="" method="post" action="/">
                <fieldset>
                    <legend>表单标题</legend>
                      <div class="bui-form-item">
                        <label for="" class="bui-label"><span class="bui-form-required">*</span>转出账号</label>
                        <select id="province" name="province" class="bui-form-selector">
                            <option value="English">0xe0245dc5c13e4055461ec381d5bcbd322f462249</option>
                            <option value="English">0xe0245dc5c13e4055461ec381d5bcbd322f462254</option>
                            <option value="English">0xe0245dc5c13e4055461ec381d5bcbd322f462344</option>
                            <option value="English">0xe0245dc5c13e4055461ec381d5bcbd322f462253</option>
                            <option value="English">0xe0245dc5c13e4055461ec381d5bcbd322f462254</option>
                            <option value="English">0xe0245dc5c13e4055461ec381d5bcbd322f462255</option>
                        </select>
                    </div>
                    <div class="bui-form-item">
                        <label for="" class="bui-label">
                          <span class="bui-form-required">*</span>
                            收款方
                        </label>
                        <div><input class="bui-input bui-input-l" type="text" placeholder="请输入对方地址"></div>
                    </div>
                    <div class="bui-form-item">
                        <label for="" class="bui-label">
                          <span class="bui-form-required">*</span>
                            金额
                        </label>
                        <input class="bui-input" type="text" placeholder="请输入转账金额">
                        <span class="bui-form-other">CZR</span>
                        <span class="bui-form-other select-none">
                          <label for="to-all">
                            <input class="bui-checkbox" id="to-all" value="" type="checkbox">
                            发送全部
                          </label>
                        </span>
                    </div>
                    <div class="bui-form-item">
                        <label for="" class="bui-label">备注</label>
                        <textarea class="bui-textarea" placeholder="选填"></textarea>
                    </div>
                    <div class="bui-form-item">
                        <label for="" class="bui-label">
                          <span class="bui-form-required">*</span>
                            手续费
                        </label>
                        <input class="bui-input" type="text" placeholder="请输入手续费">
                        <span class="bui-form-other">CZR</span>
                        <p class="expected-assets">预估手续费 20 CZR</p>
                    </div>
                    <div class="bui-form-item">
                        <input type="button" class="bui-button bui-button-green bui-button-l" value="下一步">
                    </div>
                </fieldset>
            </form>
    </div>
    <br><br><br><br><br>
     <p>从那个账号进来的：{{queryAcc || '直接进入的'}}</p> 
      <h2>默认的主账号：{{defaultAcc}}</h2>
    <h1>{{ msg }} Gas暂时使用默认</h1>
    <br><br>
    转出方：
    <select name="from_address" @change="onSelected">
      <option v-for="account in accounts" :value="account" v-once :selected="fromAcc(account)" >{{account}}</option>
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
import web3 from "@/global/web3.js";
import { throws } from "assert";
import { triggerAsyncId } from "async_hooks";

export default {
  name: "Search",
  data() {
    return {
      txid: "", //交易发送时候的TXID，需要储存
      txidInfo: "", //TXID查询的数据，需要储存
      tranTotal: "", //当前交易合计需要的ETH
      accounts: web3.eth.accounts, //当前账号列表
      fromAccount:
        this.$route.query.account ||
        web3.eth.defaultAccount ||
        web3.eth.accounts[0], //发送放的账号
      defaultAcc: web3.eth.defaultAccount, //默认的主账号

      queryAcc: this.$route.query.account, //当前路由带过来的账号信息

      toAccount: "", //接收方的地址
      transVal: 0, //交易金额
      userGas: "", //Gas

      thisAccBa: web3.fromWei(
        web3.eth
          .getBalance(this.$route.query.account || web3.eth.accounts[0])
          .toNumber(),
        "ether"
      ), //发送方的账户余额
      msg: "转账页面"
    };
  },
  computed: {
    accBalance: function() {
      var balaceWei = web3.eth.getBalance(this.currentAcc).toNumber();
      var balaceVal = web3.fromWei(balaceWei, "ether");
      return balaceVal;
    },
    defaultGas: function() {
      // var result = web3.eth.estimateGas({
      //       to: "0x93fce2c3985BEB2Ab9DF590382141479Ff159759"
      // });
      // console.log(result,web3.eth.gasPrice.toNumber())
      // console.log(web3.fromWei(result, 'ether'));
      var GasVal = web3.eth.gasPrice.toNumber() * 1000;
      this.userGas = web3.fromWei(GasVal, "ether");
      return web3.fromWei(GasVal, "ether");
    }
  },
  methods: {
    fromAcc: function(account) {
      if (this.queryAcc) {
        if (account == this.queryAcc) {
          return true;
        }
      } else {
        if (account == this.defaultAcc) {
          return true;
        }
      }
    },
    onSelected: function(ele) {
      var currentAdd = ele.target.value;
      this.fromAccount = currentAdd;
      this.thisAccBa = web3.fromWei(
        web3.eth.getBalance(currentAdd).toNumber(),
        "ether"
      );
      this.getTotal();
    },
    getToAddress: function(ele) {
      var currentAdd = ele.target.value;
      this.toAccount = currentAdd;
      this.getTotal();
    },
    getTransVal: function(ele) {
      var currentVal = ele.target.value;
      this.transVal = currentVal;
      this.getTotal();
    },
    getUserGas: function(ele) {
      var currentVal = ele.target.value;
      console.log(currentVal);
      this.userGas = currentVal;
      this.getTotal();
    },
    getTotal: function() {
      var transWeiVal = web3.toWei(this.transVal, "ether");
      var userWeiGas = web3.toWei(this.userGas, "ether");
      var TotalWei = parseInt(transWeiVal) + parseInt(userWeiGas);

      this.tranTotal = web3.fromWei(TotalWei, "ether");

      //仅仅是测试
      // this.$db.set('czr_accounts.account_list', "hahahahahahaha").write();
      console.log(
        this.$db
          .read()
          .get("czr_accounts.0x57076e46a13a61069cba47cd83db9dfd4a321505")
          .value()
      );
    },

    submitTran: function() {
      self = this;
      var options = {
        from: self.fromAccount,
        to: self.toAccount,
        value: web3.toWei(self.transVal, "ether")
        // "gas":web3.toWei(self.userGas,'ether'),
      };

      console.log(options);
      if (!self.toAccount) {
        alert("请填写地址");
        return;
      }
      web3.eth.sendTransaction(options, function(err, address) {
        if (!err) {
          var receipt = web3.eth.getTransaction(address);
          self.txid = address;
          self.txidInfo = receipt;

          // self.$db.

          if (
            self.$db
              .read()
              .has("czr_accounts." + options.from)
              .value()
          ) {
            self.$db
              .read()
              .set(
                "czr_accounts." + options.from + ".tx_list." + address,
                receipt
              )
              .write();
          }
          if (
            self.$db
              .read()
              .has("czr_accounts." + options.to)
              .value()
          ) {
            self.$db
              .read()
              .set(
                "czr_accounts." + options.to + ".tx_list." + address,
                receipt
              )
              .write();
          }

          console.log(address); //0x059b9238d7003416960db8d9f9d8de506f17574b37f03c9101c941a439fa942c
          console.log(receipt);
        } else {
          throw err;
        }
      });

      // 发送后向交易记录添加
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-transfer { text-align: left;background: #fff;border-top: 1px solid rgba(0,0,0,0.25);padding-top: 55px; }
.page-transfer .bui-form-selector { width: 420px;font-size: 14px;}
.page-transfer .bui-form-item { padding-left: 220px;}
.tran_input { width: 300px; }
.select-none {-webkit-user-select: none;}
.expected-assets{margin-top: 14px;}
</style>
