<template>
  <div class="page-transfer">
    <div class="transfer-cont">
      <!-- <p>从那个账号进来的：{{activeData.queryAcc || '直接进入的'}}</p>  -->
      <el-form ref="form" label-width="100px">
          <el-form-item label="转出账号">
              <el-select v-model="submitData.from" placeholder="请选择" style="width:100%;" @change='onSelectedFrom'>
                <el-option
                  v-for="item in initData.fromAccounts"
                  :key="item.address"
                  :label="item.tag"
                  :value="item.address">
                  <span style="float: left">{{ item.tag }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="收款方">
            <div class="trigger-contacts"  @click="dialogSeleVisible = true">
              <i class="el-icon-tickets"></i>
            </div>
            <el-input v-model="submitData.to" @change="setToAddress" ></el-input>
          </el-form-item>

          <el-form-item label="金额">
            <el-input v-model="submitData.amount" class="width-180" @change="setAmount"></el-input>
            <span>CZR</span>
            <el-checkbox v-model="initData.checkedAll" 
            @change='sendAllAmount'
            class="send-all-assets">
              发送全部&nbsp;
              <span class="czr-txt-muted">
                (&nbsp;{{activeData.hasBalance}} CZR&nbsp;)
              </span>
              
            </el-checkbox>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="submitData.remark"></el-input>
          </el-form-item>
          <el-form-item label="手续费">
            <!-- show-stops -->
              <div class="block">
                <el-slider
                  v-model="submitData.fees"
                  @change='changeGas'

                  :min='activeData.minGas'
                  :max='activeData.maxGas'
                  :step='activeData.step'
                  show-input
                  input-size	= 'mini'
                  >
                </el-slider>
              </div>
            <span class='speculate-wrap'>预估手续费：<strong v-text="this.defaultGas" v-once ></strong>CZR</span>
          </el-form-item>

          <el-form-item label="合计">
            {{activeData.tranTotal}} CZR
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="toNextStep">下一步</el-button>
          </el-form-item>
    </el-form>
    <br><br><hr>
    </div>






     <br><br><br>
  
      <br><br><br>
      <!-- <input type="button" value="确定转账" @click="submitTran"> -->
      <br><br>
      <p>发送交易的交易哈希:{{txid}}</p>
      <div style="text-align: left;">
      <pre >{{txidInfo}}</pre>
      </div>

<el-dialog
  title="提示"
  :visible.sync="dialogSeleVisible"
  width="80%">
  <span>
      <el-select v-model="submitData.to" placeholder="请选择" style="width:100%;" @change='onSelectedTo'>
        <el-option
          v-for="item in initData.contactsAccounts"
          :key="item.address"
          :label="item.tag"
          :value="item.address">
          <span style="float: left">{{ item.tag }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
        </el-option>
      </el-select>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogSeleVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogSeleVisible = false">确 定</el-button>
  </span>
</el-dialog>

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
      dialogSeleVisible:false,
      //数据开始
      initData:{
        //初始数据
        fromAccounts:this.$db.read().get('czr_accounts').value(),
        contactsAccounts:this.$db.read().get('czr_contacts.contact_ary').value(),
        checkedAll:false
      },
      activeData:{
        queryAcc: this.$route.query.account, //当前路由带过来的账号信息
        hasBalance:web3.fromWei(web3.eth.getBalance(this.$route.query.account 
              || web3.eth.accounts[0]).toNumber(),"ether"),
        minGas:0,
        maxGas:0,
        step:0,
        tranTotal:0  //当前交易合计需要的ETH
      },
      submitData:{
        //最终提交的数据
        from  :this.$route.query.account || web3.eth.accounts[0],
        to    :"",
        
        value:"",
        gas:"",

        amount:"",
        remark:"",
        fees  :0
      },
      //数据结束




      txid: "", //交易发送时候的TXID，需要储存
      txidInfo: "", //TXID查询的数据，需要储存



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
    defaultGas:function() {
        var GasVal = web3.eth.gasPrice.toNumber();
        var gasEthNum= parseFloat(web3.fromWei(GasVal, "ether"));
        this.submitData.fees=gasEthNum;
        this.activeData.minGas=gasEthNum/5;
        this.activeData.maxGas=gasEthNum*25;
        this.activeData.step=(this.activeData.maxGas-this.activeData.minGas)/15;
        
        return gasEthNum;
    }
  },
  methods: {
    onSelectedFrom:function(val){
      this.submitData.from = val;
      this.activeData.hasBalance = web3.fromWei(web3.eth.getBalance(val).toNumber(),"ether");
      this.getTotal();
    },
    onSelectedTo:function(val){
      this.submitData.to = val;
    },
    setToAddress: function(val) {
      this.getTotal();
    },
    setAmount:function(val){
      this.getTotal();
    },
    sendAllAmount:function(){
      if(this.initData.checkedAll){
        var formAccHasWeiNum=web3.eth.getBalance(this.submitData.from).toNumber();
        var gasWeiNum=web3.toWei( this.submitData.fees,'ether');
        var targetNum=web3.fromWei(formAccHasWeiNum-gasWeiNum,"ether");
        this.submitData.amount=targetNum
      }else{
        this.submitData.amount=0;
      }
      this.getTotal();
    },
    changeGas:function(val){
      this.getTotal();
    },
    getTotal: function() {
      // console.log("submitData",this.submitData)
      var transWeiVal = web3.toWei(this.submitData.amount, "ether");
      var userWeiGas = web3.toWei(this.submitData.fees, "ether");
      var TotalWei = parseInt(transWeiVal) + parseInt(userWeiGas);
      this.activeData.tranTotal = web3.fromWei(TotalWei, "ether");
    },
    test:function(){

    },
    toNextStep:function() {
      console.log('submit!');
      self = this;
      var options = this.submitData;

      console.log(options);

      if (!options.to) {
        alert("请填写地址");
      }
      return;
      
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
    }

    //   // 发送后向交易记录添加
    // }
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
