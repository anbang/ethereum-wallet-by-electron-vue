<template>
  <div class="page-transfer">
    <div class="transfer-cont">
      <p>从那个账号进来的：{{queryAcc || '直接进入的'}}</p> 
      <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="转出账号">
              <el-select v-model="value6" placeholder="请选择" style="width:100%;" @change='onSelectedFrom'>
                <el-option
                  v-for="item in cities"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="收款方">
            <div class="trigger-contacts">
              <i class="el-icon-tickets"></i>
            </div>
            <el-input v-model="form.name" ></el-input>
          </el-form-item>

          <el-form-item label="金额">
            <el-input v-model="form.name" class="width-180"></el-input>
            <span>CZR</span>
            <el-checkbox v-model="checked" class="send-all-assets">发送全部</el-checkbox>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="手续费">
              <div class="block">
                <el-slider
                  v-model="value7"
                  :min='1'
                  :max='100'
                  :step="10"
                  show-input
                  input-size	= 'mini'
                  show-stops>
                </el-slider>
              </div>
            <span class='speculate-wrap'>预估手续费：<strong>34.23</strong> CZR</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">下一步</el-button>
          </el-form-item>
    </el-form>
    <br><br><hr>
    </div>
    <br><br><br><br><br>
     <p>从那个账号进来的：{{queryAcc || '直接进入的'}}</p> 
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
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      checked:false,
      value7: 34.2789,
      cities: [{
                value: 'Beijing',
                label: '北京'
              }, {
                value: 'Shanghai',
                label: '上海'
              }, {
                value: 'Nanjing',
                label: '南京'
              }, {
                value: 'Chengdu',
                label: '成都'
              }, {
                value: 'Shenzhen',
                label: '深圳'
              }, {
                value: 'Guangzhou',
                label: '广州'
              }],
        value6: '',


      transform:{
        //最终提交的数据
        from  :"",
        to    :"",
        amount:"",
        remark:"",
        fees  :""
      },
      transSource:{
        //form
        accounts:web3.eth.accounts, //当前账号列表
        fromAccount: this.$route.query.account ||
                     web3.eth.accounts[0], //发送放的账号
        queryAcc: this.$route.query.account, //当前路由带过来的账号信息
        thisAccBa: web3.fromWei(
            web3.eth
              .getBalance(this.$route.query.account || web3.eth.accounts[0])
              .toNumber(),
            "ether"
          ), //发送方的账户余额
          tranTotal:""
      },




      txid: "", //交易发送时候的TXID，需要储存
      txidInfo: "", //TXID查询的数据，需要储存

      tranTotal: "", //当前交易合计需要的ETH
      accounts: web3.eth.accounts, //当前账号列表
      fromAccount:
        this.$route.query.account ||
        web3.eth.accounts[0], //发送放的账号
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
    onSelectedFrom:function(val){
      console.log("HAHAH",val)
    },
    //------------------------------
    onSubmit() {
      console.log('submit!');
    },
    fromAcc: function(account) {
      if (this.queryAcc) {
        if (account == this.queryAcc) {
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
.transfer-cont{padding: 0 90px;}
.page-transfer .bui-form-selector { width: 420px;font-size: 14px;}
.page-transfer .bui-form-item { padding-left: 220px;}
.tran_input { width: 300px; }
.select-none {-webkit-user-select: none;}
.expected-assets{margin-top: 14px;}

.trigger-contacts{width: 50px;height: 38px;
  background: #fff;
  position: absolute;
  right: 1px;top: 1px;
  z-index: 2;border-radius: 4px;cursor: pointer;
}
.trigger-contacts .el-icon-tickets{font-size: 24px;padding-left: 13px;padding-top: 7px;color: #a7aaaf;}
.trigger-contacts:hover{background: #dbdbff;}
.trigger-contacts:hover .el-icon-tickets{color: #5a59a0;}

.send-all-assets{margin-left: 20px;font-size: 16px;}
.speculate-wrap{color: rgb(168, 168, 168);}
</style>
