<template>
  <div class="page-transfer">
    <div class="transfer-cont">
      <el-form ref="form" label-width="100px">
          <el-form-item :label="$t('page_transfer.from_address')">
              <el-select v-model="submitData.from" :placeholder="$t('page_transfer.select')" style="width:100%;" @change='onSelectedFrom'>
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
          <el-form-item :label="$t('page_transfer.to_address')">
            <div class="trigger-contacts"  @click="dialogSeleVisible = true">
              <i class="el-icon-tickets"></i>
            </div>
            <el-input v-model="submitData.to" @change="setToAddress" ></el-input>
          </el-form-item>

          <el-form-item :label="$t('page_transfer.amount')">
            <el-input v-model="submitData.amount" class="width-180" @change="setAmount"></el-input>
            <span>{{$t('unit.czr')}}</span>
            <el-checkbox v-model="initData.checkedAll" 
            @change='sendAllAmount'
            class="send-all-assets">
              {{$t('page_transfer.send_all')}}&nbsp;
              <span class="czr-txt-muted">
                (&nbsp;{{activeData.hasBalance}} {{$t('unit.czr')}}&nbsp;)
              </span>
              
            </el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('page_transfer.remark')">
            <el-input type="textarea" v-model="submitData.remark"></el-input>
          </el-form-item>
          <el-form-item :label="$t('page_transfer.fees')">
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
            <span class='speculate-wrap'>{{$t('page_transfer.expected_fees')}} <strong v-text="this.defaultGas" v-once ></strong>{{$t('unit.czr')}}</span>
          </el-form-item>

          <el-form-item :label="$t('page_transfer.total')">
            {{activeData.tranTotal}} {{$t('unit.czr')}}
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="outerVisible = true">{{$t('confirm')}}</el-button>
            
          </el-form-item>
    </el-form>
  </div>


    <el-dialog
      :title= "$t('dialog_tit')"
      :visible.sync="dialogSeleVisible"
      width="80%">
      <span>
          <el-select v-model="submitData.to" :placeholder="$t('page_transfer.select')" style="width:100%;" @change='onSelectedTo'>
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
        <el-button @click="dialogSeleVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="dialogSeleVisible = false">{{$t('confirm')}}</el-button>
      </span>
    </el-dialog>

    <template>  
      <el-dialog 
        :title="$t('page_transfer.confirmDia.title')"
        width="65%"
        :visible.sync="outerVisible">
          <el-dialog
            width="60%"
            :title="$t('page_transfer.confirmDia.enter_passworld_tit')"
            :visible.sync="innerVisible"
            append-to-body>
            <el-form ref="form" label-width="100px">
                <el-input v-model="activeData.password" :placeholder="$t('page_transfer.confirmDia.enter_passworld_place')" type="password"></el-input>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="toNextStep">{{$t('confirm')}}</el-button>
            </div>
          </el-dialog>
          <div>
            

    <el-form ref="form"label-width="120px">
      <el-form-item :label="$t('page_transfer.from_address')">
        <p>{{submitData.from}}</p>
      </el-form-item>
        <el-form-item :label="$t('page_transfer.to_address')">
        <p>{{submitData.to}}</p>
      </el-form-item>
      <el-form-item :label="$t('page_transfer.amount')">
        <p>{{submitData.amount}} {{$t('unit.czr')}}</p>
      </el-form-item>
      <el-form-item :label="$t('page_transfer.remark')">
        <p>{{submitData.remark || '-'}}</p>
      </el-form-item>
        <el-form-item :label="$t('page_transfer.fees')">
        <p>{{submitData.fees | toString}} {{$t('unit.czr')}}</p>
      </el-form-item>
          <el-form-item :label="$t('page_transfer.total')">
        <p>{{activeData.tranTotal}} {{$t('unit.czr')}}</p>
      </el-form-item>
    </el-form>


          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="outerVisible = false">{{$t('cancel')}}</el-button>
            <el-button type="primary" @click="innerVisible = true">{{$t('confirm')}}</el-button>
          </div>
      </el-dialog>
    </template>


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
      dialogSeleVisible: false,
      outerVisible: false,
      innerVisible: false,

      //Initial data
      initData: {
        fromAccounts: this.$db
          .read()
          .get("czr_accounts")
          .value(),
        contactsAccounts: this.$db
          .read()
          .get("czr_contacts.contact_ary")
          .value(),
        checkedAll: false
      },

      activeData: {
        queryAcc: this.$route.query.account, //Current account information brought by the route
        hasBalance: web3.fromWei(
          web3.eth
            .getBalance(this.$route.query.account || web3.eth.accounts[0])
            .toNumber(),
          "ether"
        ),
        minGas: 0,
        maxGas: 0,
        step: 0,
        password: "",
        tranTotal: 0 //Total current transaction
      },

      //Final submission data
      submitData: {
        from: this.$route.query.account || web3.eth.accounts[0],
        to: "",

        value: 0,
        // gas:0,

        amount: 0,
        remark: "",
        fees: 0
      }
    };
  },
  filters: {
    toString: function(val) {
      var valueStr = web3.toBigNumber(val).toString(10);
      return valueStr;
    }
  },
  computed: {
    defaultGas: function() {
      var GasVal = web3.eth.gasPrice.toNumber();
      var gasCZR = web3.fromWei(GasVal, "ether");
      var gasEthNum = web3.toBigNumber(gasCZR).toNumber();
      this.submitData.fees = gasEthNum;
      this.activeData.tranTotal = gasCZR;
      this.activeData.minGas = gasEthNum / 5;
      this.activeData.maxGas = gasEthNum * 10;
      this.activeData.step =
        (this.activeData.maxGas - this.activeData.minGas) / 10;

      return gasCZR;
    }
  },
  methods: {
    onSelectedFrom: function(val) {
      this.submitData.from = val;
      this.activeData.hasBalance = web3.fromWei(
        web3.eth.getBalance(val).toNumber(),
        "ether"
      );
      this.getTotal();
    },
    onSelectedTo: function(val) {
      this.submitData.to = val;
    },
    setToAddress: function(val) {
      this.getTotal();
    },
    setAmount: function(val) {
      this.getTotal();
    },
    sendAllAmount: function() {
      if (this.initData.checkedAll) {
        var formAccHasWeiNum = web3.eth
          .getBalance(this.submitData.from)
          .toNumber();
        var gasWeiNum = web3.toWei(this.submitData.fees, "ether");
        var targetNum = web3.fromWei(formAccHasWeiNum - gasWeiNum, "ether");
        this.submitData.amount = targetNum;
      } else {
        this.submitData.amount = 0;
      }
      this.getTotal();
    },
    changeGas: function(val) {
      this.getTotal();
    },
    getTotal: function() {
      var transWeiVal = web3.toWei(this.submitData.amount, "ether");
      var userWeiGas = web3.toWei(this.submitData.fees, "ether");
      var TotalWei = parseInt(transWeiVal) + parseInt(userWeiGas);
      this.activeData.tranTotal = web3.fromWei(TotalWei, "ether");
    },
    test: function() {},
    toNextStep: function() {
      var self = this;
      var options = self.submitData;
      // options.gas=web3.toWei(options.fees, "ether");
      options.value = web3.toWei(options.amount, "ether");

      console.log(options);
      if (!options.to) {
        // alert("Please fill in the address");
        return;
      }
      //Units that convert the quantity and amount of Gas

      web3.eth.sendTransaction(options, function(err, address) {
        if (!err) {
          var receipt = web3.eth.getTransaction(address);

          var testFrom = self.$db
            .read()
            .get("czr_accounts")
            .find({ address: options.from })
            .value();
          var testTo = self.$db
            .read()
            .get("czr_accounts")
            .find({ address: options.to })
            .value();

          if (testFrom) {
            self.$db
              .read()
              .get("czr_accounts")
              .find({ address: options.from })
              .get("tx_list")
              .unshift(receipt)
              .write();
          }

          if (testTo) {
            self.$db
              .read()
              .get("czr_accounts")
              .find({ address: options.to })
              .get("tx_list")
              .unshift(receipt)
              .write();
          }

          //Clear data
          self.outerVisible = false;
          self.innerVisible = false;
          self.submitData.to = "";
          self.submitData.amount = 0;
          self.submitData.value = 0;
          self.submitData.remark = "";
          self.$router.push("/account/" + self.submitData.from);
        } else {
          throw err;
        }
      });
    }
  }
};
</script>
<style scoped>
.page-transfer {
  text-align: left;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  padding: 38px 0 20px;
}
.transfer-cont {
  padding: 0 90px;
}
.page-transfer .bui-form-selector {
  width: 420px;
  font-size: 14px;
}
.page-transfer .bui-form-item {
  padding-left: 220px;
}
.tran_input {
  width: 300px;
}
.select-none {
  -webkit-user-select: none;
}
.expected-assets {
  margin-top: 14px;
}

.trigger-contacts {
  width: 50px;
  height: 38px;
  background: #fff;
  position: absolute;
  right: 1px;
  top: 1px;
  z-index: 2;
  border-radius: 4px;
  cursor: pointer;
}
.trigger-contacts .el-icon-tickets {
  font-size: 24px;
  padding-left: 13px;
  padding-top: 7px;
  color: #a7aaaf;
}
.trigger-contacts:hover {
  background: #dbdbff;
}
.trigger-contacts:hover .el-icon-tickets {
  color: #5a59a0;
}

.send-all-assets {
  margin-left: 20px;
  font-size: 16px;
}
.speculate-wrap {
  color: rgb(168, 168, 168);
}
</style>
