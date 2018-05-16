<template>
  <div class="page-account-detail">
    <div class="account-banner">
      <div class="active-icon">
        <router-link :to="'/transfer?account=' + address" tag="div"  class="acc-interactive">
                <i class="iconfont">&#xe605;</i>
            <p class="icon-des">{{ $t('page_account.active_icon.go_transfer') }}</p>
        </router-link>
        <div class="acc-interactive" @click="exportKeystore">
          <i class="iconfont">&#xe628;</i>
          <p class="icon-des">{{ $t('page_account.active_icon.import_keystore') }}</p>
        </div>

        <div class="acc-interactive" @click="showQrCode">
          <i class="iconfont">&#xe628;</i>
          <p class="icon-des">{{ $t('page_account.active_icon.qrcode') }}</p>
        </div>
      </div>

      <div class="account-center">
        <div class="account-alias-wrap">
          <span class="text-sub-color">{{ accountInfo.tag }}</span>
          <i class="iconfont icon-edit-alias"   @click="dialogSwitch.editName = true"> &#xe604; </i>
        </div>
        <div class="account-has-assets">
          <h1 class="account-assets">{{ accountInfo.balance | toCZRVal }}</h1>
          <span>{{ $t('unit.czr') }}</span>
        </div>
        <div class="account-address-wrap">
          <span class="text-sub-color">{{ address }}</span>
          <i class="iconfont icon-address-copy" @click="copyAddress"> &#xe645; </i>
        </div>
      </div>

    </div>
    
    <div class="account-content">
      <h2 class="transfer-tit">{{ $t('page_account.transfer_log') }}</h2>
      <div class="transfer-log">
        <template v-for="item in accountInfo.tx_list">
            <div v-if="item.to == address">
              <div   class="transfer-item b-flex b-flex-justify plus-assets">
                <div class="icon-wrap">
                  <i class="iconfont icon-transfer">&#xe639;</i>
                </div>
                <div class="transfer-info">
                  <p class="by-address">{{item.from}}</p>
                  <p class="transfer-time">{{item.timestamp |toDate }}</p>
                </div>
                <div class="transfer-assets">
                  <div class="assets">+ {{item.value | toCZRVal }} {{ $t('unit.czr') }}</div>
                </div>
              </div>
            </div>

            <div v-if="item.from == address">
                  <div class="transfer-item b-flex b-flex-justify less-assets">
                  <div class="icon-wrap">
                    <i class="iconfont icon-transfer">&#xe638;</i>
                  </div>
                  <div class="transfer-info">
                    <p class="by-address">{{item.to}}</p>
                    <p class="transfer-time">{{item.timestamp |toDate }}</p>
                  </div>
                  <div class="transfer-assets">
                    <div class="assets">- {{item.value | toCZRVal }} {{ $t('unit.czr') }}</div>
                  </div>
                </div>
            </div>
        </template>
      </div>
      
      <!--  No transaction record  -->
      <div v-if="accountInfo.tx_list.length==0" class="no-transfer-log">
        <i class="iconfont">&#xe6e7;</i>
        <p>{{ $t('page_account.transfer_log_null') }}</p>
      </div>
    </div>

    <el-dialog
      :title="$t('dialog_tit')"
      :visible.sync="dialogSwitch.qrCode"
      width="40%" center>
      <span>
        <img :src="qrImgUrl" alt="code" class="qrcode-img">
        <p class="dia-address">{{address}}</p>
      </span>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSwitch.qrCode = false">{{$t('close')}}</el-button>
      </span> -->
    </el-dialog>

    <el-dialog
      :title="$t('page_account.edit_dia.tit')"
      :visible.sync="dialogSwitch.editName"
      width="65%" center>
      <span>
        <p class="edit-name-subtit">{{$t('page_account.edit_dia.subtit')}}</p>
        <el-input v-model="editTag"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSwitch.editName = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="setEditTag">{{$t('confirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('page_account.keystore.copy')" :visible.sync="dialogSwitch.keystore">
      <el-input
        v-if="accountInfo"
        :value="JSON.stringify(accountInfo.keystore)"
        type="textarea"
        :autosize="{minRows: 2}">
      </el-input>
      <div slot="footer">
        <el-button @click="copyKeystore">{{$t('page_account.keystore.copy')}}</el-button>
        <el-button type="primary" @click="downloadKeystore">{{$t('page_account.keystore.download')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const { clipboard } = require("electron");
import QRCode from "qrcode";
let self=null;

export default {
  name: "Account",
  data() {
    return {
      dialogSwitch:{
        qrCode:false,
        editName:false,
        keystore:false
      },
      address: this.$route.params.id,
      accountInfo: null,
      qrImgUrl: "",
      editTag:""
    };
  },
  created(){
    self=this;
    QRCode.toDataURL(this.address,{width:800},function(err, url) {
      if (err) {
        console.log(err)
        return
      }
      self.qrImgUrl = url;
    });

    this.accountInfo=this.$db
        .read()
        .get("czr_accounts")
        .filter({ address: this.address })
        .value()[0]
    this.initTag();
    this.getBalance()
  },

  computed: {},
  methods: {
    //Init 
    initTag:function(){
        this.editTag=this.accountInfo.tag;
    },
    getBalance () {
        this.$web3.eth.getBalance(this.address)
            .then(data => {
                this.accountInfo.balance = data
                // reWrite balance
                this.$db
                  .read()
                  .get("czr_accounts")
                  .find({ address: this.address })
                  .assign({ balance: data })
                  .write();

            })
            .catch(console.log)
    },

    //Copy Address
    copyAddress: function() {
      clipboard.writeText(this.address);
      this.$message({
        message: this.$t("page_account.msg_info.ads_copy_success"),
        type: "success"
      });
    },

    //Show Qrcode
    showQrCode: function() {
      this.dialogSwitch.qrCode = true;
    },

    //Edit Tag
    setEditTag: function() {
      this.$db
        .read()
        .get("czr_accounts")
        .find({ address: this.address })
        .assign({ tag: this.editTag })
        .write();
      this.accountInfo.tag=this.editTag
      this.dialogSwitch.editName = false;
    },

    //export Keystore
    exportKeystore () {
      this.dialogSwitch.keystore = true
    },

    //copy
    copyKeystore () {
      clipboard.writeText(JSON.stringify(this.accountInfo.keystore))
      this.$message.success(this.$t("page_account.msg_info.key_copy_success"))
      this.dialogSwitch.keystore = false
    },

    //download
    downloadKeystore () {
      let link = document.createElement('a')
      link.download = this.getNowTime()+"--"+this.address;
      link.style.display = 'none'
      let blob = new Blob([JSON.stringify(this.accountInfo.keystore)])
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.dialogSwitch.keystore = false
    },
    getNowTime:function () {
        let date = new Date();
        let addZero=this.addZero;
        let LocalTime = date.getFullYear() + "-" +addZero(date.getMonth()+1) + "-" + addZero(date.getDate()) + "-" +
            addZero(date.getHours()) + addZero(date.getMinutes()) +  addZero(date.getSeconds());
        return LocalTime;
    },
    addZero:function (val) {
        return val<10 ? "0"+val : val;
    },


  },
  filters: {
    toCZRVal: function(val) {
      let tempVal=self.$web3.utils.fromWei(val, 'ether');
      return tempVal;//TODO Keep 4 decimal places
    },
    toDate:function(val){
      let newDate = new Date();
      newDate.setTime(val * 1000);
      return (newDate.getMonth()+1)+"/"+newDate.getDate()+ ' / '+ newDate.getFullYear() +" "+
            (newDate.getHours()) + ":"+ (newDate.getMinutes()) + ":"+  (newDate.getSeconds());
      // console.log(newDate);
      // console.log(newDate.getFullYear());
      // console.log(newDate.getMonth()+1);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.account-banner {
  height: 175px;
  text-align: center;
  background-color: #5a59a0;
  color: #fff;
  width: 100%;
  /* -webkit-user-select: none; */
  position: relative;
}


.account-banner  .active-icon{
  padding: 10px 10px;
  min-width: 200px;
  position: absolute;
  top: 0;
  right: 0;
}
.account-banner .acc-interactive{
  margin: 10px;
  display: inline-block;
}
.account-banner .acc-interactive:hover {
  cursor: pointer;
}
.account-banner .acc-interactive:hover .icon-des {
  color: #e7e7ff;
} 
.account-banner .acc-interactive:hover .iconfont {
  color: #e7e7ff;
} 
.account-banner .acc-interactive .iconfont {
  font-size: 18px;
  color: #bfbef8;
}
.account-banner .icon-des {
  font-size: 12px;
  min-width: 40px;
  color: #bfbef8;
}


.account-banner .account-center {
  z-index: 20;
  width: 420px;
  margin: 0 auto;
  /* text-align: left; */
}
.account-banner .account-center .iconfont {
  color: #c4c3f7;
  cursor: pointer;
  width: 24px;
  height: 24px;
}
.account-banner .account-center .iconfont:hover {
  color: #e7e7ff;
}
.account-center {
  padding-top: 38px;
}
.account-has-assets {
  margin: 10px 0 15px;
}
.account-has-assets .account-assets {
  font-size: 24px;
  display: inline-block;
}

.account-content {
  text-align: left;
  padding: 0 20px;
  margin-top: 40px;
}
.account-content .transfer-tit {
  font-size: 18px;
  font-weight: 400;
}

/* Transaction Record */
.account-content .no-transfer-log {
  text-align: center;
  color: #9b9b9b;
}
.account-content .no-transfer-log .iconfont {
  font-size: 128px;
}
.account-content .transfer-log {
  padding: 22px 0;
}

.transfer-log .transfer-item {
  background-color: #fff;
  padding: 10px 15px;
  margin-bottom: 2px;
  cursor: pointer;
  -webkit-user-select: none;
}
.account-content .transfer-log .transfer-info {
  width: 300px;
  text-align: left;
}
.transfer-log .icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
.transfer-log .icon-wrap .icon-transfer {
  color: #fff;
  position: relative;
  left: 11px;
  top: 4px;
  font-size: 20px;
}
.transfer-log .plus-assets .icon-wrap {
  background-color: rgba(0, 128, 0, 0.555);
}
.transfer-log .less-assets .icon-wrap {
  background-color: rgba(255, 153, 0, 0.555);
}
.transfer-log .by-address {
  color: rgb(54, 54, 54);
}
.transfer-log .transfer-time {
  color: rgb(161, 161, 161);
}
.transfer-log .transfer-assets .assets {
  font-size: 18px;
  height: 42px;
  line-height: 42px;
  width: 300px;
  text-align: right;
}
.plus-assets .assets {
  color: green;
}
.less-assets .assets {
  color: rgb(255, 51, 0);
}
.qrcode-img {
  width: 100%;
  height: auto;
  display: block;
}
.dia-address {
  text-align: center;
  table-layout: fixed;
  word-break: break-all;
  overflow: hidden;
}
.edit-name-subtit {
  margin-bottom: 30px;
  text-align: center;
}


</style>
