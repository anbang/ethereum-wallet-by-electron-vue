<template>
  <div class="page-transfer">
    <div class="transfer-cont">
      <el-form ref="form" label-width="100px">
          <el-form-item :label="$t('page_transfer.from_address')">
              <el-select v-model="fromAccount" :placeholder="$t('page_transfer.select')" style="width:100%;" >
                <el-option
                  v-for="item in database"
                  :key="item.address"
                  :label="item.address"
                  :value="item.address">
                  <span style="float: left">{{ item.tag }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item :label="$t('page_transfer.to_address')">
            <div class="trigger-contacts"  @click="dialogVisible.contacts = true">
              <i class="el-icon-tickets"></i>
            </div>
            <el-input v-model="toAccount" ></el-input>
          </el-form-item>

          <el-form-item :label="$t('page_transfer.amount')">
            <el-input v-model="amount"
             min="0" :max="accountInfo.balance"
             class="width-180" ></el-input>
            <span>{{$t('unit.czr')}}</span>
            <el-checkbox v-model="checkedAll" 
            @change='sendAllAmount'
            class="send-all-assets">
              {{$t('page_transfer.send_all')}}&nbsp;
              <span class="czr-txt-muted">
                (&nbsp;{{accountInfo.balance | toEthVal}} {{$t('unit.czr')}}&nbsp;)
              </span>
              
            </el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('page_transfer.remark')">
            <el-input type="textarea" v-model="extraData"></el-input>
          </el-form-item>
          <el-form-item :label="$t('page_transfer.fees')">
            <!-- show-stops -->
              <div class="block">
                <el-slider
                  v-model="feePercent"
                  :max="200" :min="2" 
                  >
                </el-slider>
              </div>
            <span class='speculate-wrap'>{{$t('page_transfer.expected_fees')}} <strong v-text="fee" ></strong>{{$t('unit.czr')}}</span>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="validateForm">{{$t('confirm')}}</el-button>
            
          </el-form-item>
    </el-form>
  </div>

    <!-- Dialog select contacts -->
    <el-dialog
      :title= "$t('dialog_tit')"
      :visible.sync="dialogVisible.contacts"
      width="70%">
      <span>
          <el-select v-model="selectedContact" :placeholder="$t('page_transfer.select')" style="width:100%;" >
            <el-option
              v-for="item in contacts"
              :key="item.address"
              :label="item.tag"
              :value="item.address">
              <span style="float: left">{{ item.tag }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
            </el-option>
          </el-select>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.contacts = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="confrimContacts">{{$t('confirm')}}</el-button>
      </span>
    </el-dialog>

    <template>  
      <el-dialog 
        :title="$t('page_transfer.confirmDia.title')"
        width="65%"
        :visible.sync="dialogVisible.confrim">

          <el-form ref="form"label-width="120px">
            <el-form-item :label="$t('page_transfer.from_address')">
              <p>{{fromAccount}}</p>
            </el-form-item>
              <el-form-item :label="$t('page_transfer.to_address')">
              <p>{{toAccount || "-"}}</p>
            </el-form-item>
            <el-form-item :label="$t('page_transfer.amount')">
              <p>{{amount}} {{$t('unit.czr')}}</p>
            </el-form-item>
            <el-form-item :label="$t('page_transfer.remark')">
              <p>{{extraData || '-'}}</p>
            </el-form-item>
              <el-form-item :label="$t('page_transfer.fees')">
              <p>{{fee}} {{$t('unit.czr')}}</p>
            </el-form-item>
                <el-form-item :label="$t('page_transfer.total')">
              <p>{{confrimTotal}} {{$t('unit.czr')}}</p>
            </el-form-item>
          </el-form>          
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible.confrim = false">{{$t('cancel')}}</el-button>
            <el-button type="primary" @click="dialogVisible.passworld = true">{{$t('confirm')}}</el-button>
          </div>

          <el-dialog
            width="60%"
            :title="$t('page_transfer.confirmDia.enter_passworld_tit')"
            :visible.sync="dialogVisible.passworld"
            append-to-body>
              <el-alert
                v-if="alertMsg"
                :title="alertMsg.content"
                :closable="false"
                :type="alertMsg.type"
                show-icon>
              </el-alert>
            <el-form ref="form" label-width="100px">
                <el-input v-model="fromAccountPwd" :placeholder="$t('page_transfer.confirmDia.enter_passworld_place')" type="password"></el-input>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible.passworld = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="sendTransaction">{{$t('confirm')}}</el-button>
            </div>
          </el-dialog>

      </el-dialog>
    </template>


  </div>
</template>

<script>
var self=null;
export default {
  name: "Search",
  data() {
    return {
        alertMsg:null,
        dialogVisible:{
          contacts:false,
          confrim:false,
          passworld:false
        },

        database: [],
        fromAccount: '',
        fromAccountPwd:"",

        contacts:[],
        selectedContact: '',

        gasPrice: '',

        feePercent: 100,
        gasLimit: 200000,//参考  myetherwallet
        checkedAll: false,
        amount: 0,
        extraData: '',
        toAccount: ''
    };
  },

  created(){
    self=this;
    this.database = this.$db.get('czr_accounts').value();
    this.contacts = this.$db.get('czr_contacts.contact_ary').value();
    this.fromAccount = this.$route.query.account || this.database[0].address 
    this.refresh()
    this.getGasPrice()
  },

  computed: {
    //初始化手续费
    fee () {
      if (this.selectedGasPrice) {
        //Transaction Fees  ＝  Gas Limit * Gas Price
        let fee = this.selectedGasPrice * this.gasLimit + '';
        return this.$web3.utils.fromWei(fee, 'ether')
      } else {
        return 0
      }
    },
    selectedGasPrice () {
        if (this.gasPrice) {
            return Math.ceil(this.gasPrice * (this.feePercent / 100))
        }
    },
    //初始化账户余额等信息
    accountInfo () {
      if (this.fromAccount) {
        return this.database.find(item => item.address === this.fromAccount)
      } else {
        return {}
      }
    },
    confrimTotal:function(){
      var amountWei=this.$web3.utils.toWei(this.amount.toString(), 'ether');
      var feeWei=this.$web3.utils.toWei(this.fee.toString(), 'ether');
      var totalVal=Number(amountWei)+Number(feeWei);
      var totalVal=this.$web3.utils.fromWei(totalVal.toString(), 'ether');
      return totalVal;
    },





  },
  methods: {
    //Init data
    refresh () {
        this.database.forEach(item => {
            this.getBalance(item)
        })
    },
    getBalance (item) {
        let _this = this
        this.$web3.eth.getBalance(item.address)
            .then(data => {
                // item.balance = _this.$web3.utils.fromWei(data, 'ether')
                item.balance = data
            })
            .catch(err => {
                console.log(err)
            })
    },
    getGasPrice () {
      this.$web3.eth.getGasPrice()
          .then(data => {
              this.gasPrice = data
          })
    },
    confrimContacts:function(){
      this.toAccount=this.selectedContact;
      this.dialogVisible.contacts = false
    },
    sendAllAmount: function() {
      if (this.checkedAll) {
        var weiVal=this.accountInfo.balance - this.$web3.utils.toWei(this.fee, 'ether');
        var targetVal=self.$web3.utils.fromWei(weiVal.toString(10), 'ether');
        this.amount = Number(targetVal)>=0 ? targetVal : 0 ;
      } else {
        this.amount = 0;
      }
    },

    //confrim validate
    validateForm:function(){
      //todo Validate'
      console.log("Validate")
      this.dialogVisible.confrim = true
    },


    //send transaction

    sendTransaction:function(){
      console.log("send")
      let self=this;
      let value = this.$web3.utils.toWei(this.amount.toString(), 'ether');      
      let account = null

      //TODO 私钥通过密码+keystore解析出来；
      try {
        account = this.$web3.eth.accounts.decrypt(JSON.stringify(this.accountInfo.keystore), this.fromAccountPwd)
      } catch (e) {
        console.log('sendDecryptWalletError', e)
        this.alertMsg = {
          content: '钱包解析失败，可能是密码错误',
          type: 'error'
        }
        return
      }
      //Signs an Ethereum transaction with a given private key
      this.$web3.eth.accounts.signTransaction({
        to: this.toAccount,
        value: value,
        gas: this.gasLimit,//Gas Limit
        gasPrice: this.selectedGasPrice,//Gas Price
        data: this.extraData
//      }, this.accountInfo.privateKey)
      }, account.privateKey)
        .then(hex => {
            /*{
                messageHash: '0x6893a6ee8df79b0f5d64a180cd1ef35d030f3e296a5361cf04d02ce720d32ec5',
                r: '0x9ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9c',
                s: '0x440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428',
                v: '0x25',
                rawTransaction: '0xf86a8086d55698372431831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a009ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9ca0440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428'
            }
            */
          console.log("hex",hex)
          return this.$web3.eth.sendSignedTransaction(hex.rawTransaction)
        })
        .then(data => {
/*
           {
              transactionHash: "0x79606c95358ff6b6f6bd585fa2801a1e2fa418753ff5bf84a00472f8a0eda96f",
              transactionIndex: 0,
              blockHash: "0x657d7609ff7abc77fcde66dc7559e8e631acd8705186c9a17dcaf2111126c761",
              blockNumber: 1,
              contractAddress : null
              cumulativeGasUsed : 21000
              gasUsed : 21000
              logs : Array(0)
              logsBloom : "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
              status : true
           }
*/            
            console.log("发送成功",data)
            this.$web3.eth.getTransaction(data.transactionHash).then(receiptData =>{
                console.log("receipt",receiptData);
                this.$web3.eth.getBlock(data.blockHash).then(blockObj =>{
                    console.log("blockObj",blockObj.timestamp);
                    receiptData.timestamp=blockObj.timestamp;

                    let testFrom = self.$db.get("czr_accounts").find({ address: account.address }).value();
                    var testTo = self.$db.get("czr_accounts").find({ address: self.toAccount }).value();

                    if (testFrom) {
                      self.$db.get("czr_accounts").find({ address: account.address }).get("tx_list").unshift(receiptData).write();
                    }

                    if (testTo) {
                      self.$db.get("czr_accounts").find({ address: self.toAccount }).get("tx_list").unshift(receiptData).write();
                    }

                    this.$message.success('发送成功')
                    //Clear data
                    self.dialogVisible.confrim = false;
                    self.dialogVisible.passworld = false;
                    self.$router.push("/account/" + account.address);

                })
            })

        })
        .catch(err => {
          console.log(err)
          this.$message.error('交易失败：请检查是否有足量余额和矿工费')
        })
    }

  },
  filters: {
    toEthVal:function(val){
      var tempVal=self.$web3.utils.fromWei(val, 'ether');
      return tempVal;//TODO 保留4位小数
    }
  },
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
