<template>
    <div class="page-czr-home">
        <div class="home-banner">
            <i class="iconfont icon-logo">&#xe650;</i>
            <div>
                <el-button size="small" plain @click="dialogSwitch.import = true">{{ $t('page_home.import_account') }}</el-button>
            </div>
        </div>

        <div class="home-content">
            <div class="account-wrap b-flex">
                <template v-for="account in database">
                    <router-link :to="'/account/' + account.address" tag="div" class="accounrt-item ">
                        <div class="account-avatar">
                          <i class="iconfont ico-avatar">&#xe602;</i>
                        </div>
                        <i class="iconfont delete-acc" @click.stop="showRemoveDia(account.address)">&#xe613;</i>
                        <div class="account-cont">
                            <p class="account-remark">{{account.tag}}</p>
                            <h1 class="account-assets">{{account.balance | toEthVal}}</h1>
                            <p class="account-unit">{{ $t('unit.czr') }}</p>
                            <p class="account-address">{{account.address}}</p>
                        </div>  
                    </router-link>
                </template>
                <!--  ADD  -->
                <div class="accounrt-item add-account" @click="dialogSwitch.create = true">
                    <div class="account-cont">
                      <i class="iconfont icon-add-acc">&#xe63b;</i>
                      <p class="add-acc-des">{{ $t('page_home.add_account') }}</p>
                    </div>  
                </div>
            </div>
        </div>


        <el-dialog
          :title="createInfo.step === 0 ? $t('page_home.create_dia.create_tit') : $t('page_home.create_dia.backup_tit') "
          :visible.sync="dialogSwitch.create"
          @open="initCreateInfo"
          width="60%">
          <template v-if="createInfo.step === 0">
            <el-alert
              v-if="createInfo.error"
              :title="createInfo.error"
              :closable="false"
              type="error"
              show-icon>
            </el-alert>
            <el-input v-model="createInfo.tag" :placeholder="$t('page_home.create_dia.placeholder_tag')">
              <template slot="prepend"><i class="el-icon-tickets"></i> {{$t('page_home.create_dia.create_tag')}}</template>
            </el-input>
            <el-input v-model="createInfo.pwd" :placeholder="$t('page_home.create_dia.placeholder_pwd')" type="password">
              <template slot="prepend"><i class="el-icon-edit"></i> {{$t('page_home.create_dia.create_pwd')}}</template>
            </el-input>
            <el-input v-model="createInfo.repwd" :placeholder="$t('page_home.create_dia.placeholder_repwd')" type="password">
              <template slot="prepend"><i class="el-icon-edit"></i> {{$t('page_home.create_dia.create_repwd')}}</template>
            </el-input>
            <div slot="footer">
              <el-button @click="dialogSwitch.create = false">{{ $t('cancel') }}</el-button>
              <el-button type="primary" @click="createAccount">{{ $t('confirm') }}</el-button>
            </div>
          </template>
          <template v-else-if="createInfo.step === 1">
            <el-alert
              :title="$t('page_home.msg_info.create_success')"
              :description="$t('page_home.msg_info.save')"
              :closable="false"
              type="success"
              show-icon>
            </el-alert>
            <el-input :value="createInfo.address">
              <template slot="prepend">{{$t('page_home.create_dia.account_address')}}</template>
            </el-input>
            <el-input :value="createInfo.privateKey">
              <template slot="prepend">{{$t('page_home.create_dia.account_privateKey')}}</template>
            </el-input>
            <div slot="footer">
              <el-button type="primary" @click="downloadKeystore">{{$t('page_home.create_dia.account_download_keystore')}}</el-button>
            </div>
          </template>
        </el-dialog>

        <el-dialog
          :title="$t('page_home.import_dia.tit')"
          :visible.sync="dialogSwitch.import"
          @open="initImportInfo"
          width="50%">
          <template v-if="importInfo.step === 0">
            <div class="import-type-wrap">
              <div class="text"> {{$t('page_home.import_dia.select_type')}} </div>
              <el-radio v-model="importInfo.type" label="0" border> {{$t('page_home.import_dia.type_private')}} </el-radio>
              <el-radio v-model="importInfo.type" label="1" border> {{$t('page_home.import_dia.type_keystore')}} </el-radio>
            </div>
            <div slot="footer">
              <el-button @click="dialogSwitch.import = false">{{ $t('cancel') }}</el-button>
              <el-button type="primary" @click="importInfo.step = 1">{{ $t('confirm') }}</el-button>
            </div>
          </template>
          <template v-if="importInfo.step === 1">
            <el-alert
              v-if="importInfo.alert"
              :title="importInfo.alert.content"
              :closable="false"
              :type="importInfo.alert.type"
              show-icon>
            </el-alert>
            <template v-if="importInfo.type === '0'">

              <el-input
                v-model="importInfo.privateKey"
                type="textarea"
                :autosize="{minRows: 2}"
                :placeholder="$t('page_home.import_dia.placeholder_private')">
              </el-input>

              <el-input v-model="importInfo.tag" :placeholder="$t('page_home.create_dia.placeholder_tag')" >
                <template slot="prepend"><i class="el-icon-document"></i> {{$t('page_home.create_dia.create_tag')}}</template>
              </el-input>

              <el-input v-model="importInfo.pwd" :placeholder="$t('page_home.create_dia.placeholder_pwd')"  type="password">
                <template slot="prepend"><i class="el-icon-edit"></i> {{$t('page_home.create_dia.create_pwd')}}</template>
              </el-input>

              <el-input v-model="importInfo.repwd" :placeholder="$t('page_home.create_dia.placeholder_repwd')"  type="password">
                <template slot="prepend"><i class="el-icon-edit"></i> {{$t('page_home.create_dia.create_repwd')}}</template>
              </el-input>

            </template>
            <template v-if="importInfo.type === '1'">
              <div v-if="!importInfo.keystore" class="holder" @dragover.prevent.stop @drop.prevent.stop="importKeystore"> {{$t('page_home.import_dia.placeholder_keystore')}} </div>
              <el-input v-model="importInfo.tag"  :placeholder="$t('page_home.create_dia.placeholder_tag')" >
                <template slot="prepend"><i class="el-icon-document"></i> {{$t('page_home.create_dia.create_tag')}}</template>
              </el-input>
              <el-input v-model="importInfo.pwd" :placeholder="$t('page_home.import_dia.placeholder_pwd')" type="password">
                <template slot="prepend"><i class="el-icon-edit"></i> {{$t('page_home.import_dia.input_pwd')}}</template>
              </el-input>
            </template>
            <div slot="footer">
              <el-button @click="dialogSwitch.import = false">{{ $t('cancel') }}</el-button>
              <el-button type="primary" @click="importAccount">{{ $t('confirm') }}</el-button>
            </div>
          </template>
        </el-dialog>


        <el-dialog
          :title="$t('page_home.remove_dia.tit')"
          :visible.sync="dialogSwitch.remove"
          width="50%" >
          <span>
            <p class="remove-acc">
              {{this.removeAccount}}
            </p>
            {{ $t('page_home.remove_dia.backup') }}
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSwitch.remove = false">{{ $t('cancel') }}</el-button>
            <el-button type="danger" @click="removeAccountFn">{{ $t('page_home.remove_dia.remove_confrim') }}</el-button>
          </span>
        </el-dialog>

    </div>

</template>

<script>
const fs = require("fs");
let  self=null;

export default {
  name: "Bodyer",
  data() {
    return {
      dialogSwitch:{
        create:false,
        import:false,
        remove:false
      },
      database:[],
      createInfo: {},
      importInfo: {},
      removeAccount:""
    };
  },
  created(){
    self=this;
    this.database = this.$db.get('czr_accounts').value();;
    this.initCreateInfo()
    this.initImportInfo()
    this.refresh()
  },
  computed: {

  },
  methods: {
    //Init Start
    initCreateInfo () {
      this.createInfo = {
        tag: this.$t('page_home.acc') + (this.database.length + 1),
        pwd: '',
        repwd: '',

        step: 0,
        error: '',

        address: '',
        keystore: null,
        privateKey: ''
      }
    },
    initImportInfo () {
      this.importInfo = {
        tag: this.$t('page_home.acc') + (this.database.length + 1),
        pwd: '',
        repwd: '',

        step: 0,
        type: '0',
        alert: null,
      
        privateKey: '',
        keystore: null
      }
    },
    refresh () {
      this.database.forEach(item => {
          this.getBalance(item)
      })
    },
    getBalance (item) {
      this.$web3.eth.getBalance(item.address)
          .then(data => {
              item.balance = data
              //TODO If it is written to the database, it causes the deletion of the import to be out of sync;
              /* this.$db
                  .read()
                  .get("czr_accounts")
                  .find({ address: item.address })
                  .assign({ balance: data })
                  .write(); */
          })
          .catch(console.log )
    },
    //Init End

    initAccount:function(params){
      let  self=this;
      let account = this.$db.get('czr_accounts')
        .find({ address: params.address })
        .value()
      if(account){
          this.$message.error(this.$t('page_home.msg_info.exist')+'"'+account.tag+'"')
          return
      }
      this.$db
          .get("czr_accounts")
          .push(params)
          .write();
      this.getBalance(params)
    },

    // Create Account Start
    createAccount:function(){
      if (!this.createInfo.pwd || !this.createInfo.repwd) {
        this.createInfo.error = this.$t('page_home.msg_info.enter_password')
        return
      }
      if (this.createInfo.pwd !== this.createInfo.repwd) {
        this.createInfo.error = this.$t('page_home.msg_info.incons_password')
        return
      }
      if(this.createInfo.pwd.length<8 || this.createInfo.repwd.length<8){
        this.createInfo.error = this.$t('page_home.create_dia.strong_password')
        return
      }
      let account = this.$web3.eth.accounts.create()
      this.createInfo.address = account.address;
      this.createInfo.privateKey = account.privateKey
      this.createInfo.keystore = this.$web3.eth.accounts.encrypt(account.privateKey, this.createInfo.pwd)

      let params = {
        address: account.address,
        tag: this.createInfo.tag || this.$t('page_home.acc') + (this.database.length + 1),
        keystore: this.createInfo.keystore,
        tx_list: [],
        balance: "0"
      }
      this.initAccount(params)
      this.createInfo.step = 1
    },
    downloadKeystore () {
      let link = document.createElement('a')
      link.download = this.getNowTime()+"--"+this.createInfo.address;
      link.style.display = 'none';
      let blob = new Blob([JSON.stringify(this.createInfo.keystore)])
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.dialogSwitch.create = false
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
    // Create Account End

    //Import Start
    importKeystore (event) {
      let path = event.dataTransfer.files[0].path;
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          this.$message.error(this.$t('page_home.msg_info.error')+':' + err)
        }
        this.importInfo.keystore = JSON.parse(data)
        this.importInfo.alert = {
          content: this.$t('page_home.msg_info.imported_success'),
          type: 'success'
        }
      })
    },
    importAccount () {
      let account = null
      if (this.importInfo.type === '0') {
        if (!this.importInfo.privateKey) {
          this.importInfo.alert = {
            content: this.$t('page_home.msg_info.enter_private'),
            type: 'error'
          }
          return
        }
        if (!this.importInfo.pwd || !this.importInfo.repwd) {
          this.importInfo.alert = {
            content: this.$t('page_home.msg_info.enter_password'),
            type: 'error'
          }
          return
        }
        if (this.importInfo.pwd !== this.importInfo.repwd) {
          this.importInfo.alert = {
            content: this.$t('page_home.msg_info.incons_password'),
            type: 'error'
          }
          return
        }
        if(this.importInfo.pwd.length<8 || this.importInfo.repwd.length<8){
          this.importInfo.alert = {
            content: this.$t('page_home.create_dia.strong_password'),
            type: 'error'
          }
          return
        }

        if (this.importInfo.privateKey.indexOf('0x') !== 0) {
          this.importInfo.privateKey = '0x' + this.importInfo.privateKey
        }
        try {
          account = this.$web3.eth.accounts.privateKeyToAccount(this.importInfo.privateKey)
          this.importInfo.keystore = this.$web3.eth.accounts.encrypt(this.importInfo.privateKey, this.importInfo.pwd)
        } catch (e) {
          console.log('importPrivateKeyError', e)
          this.importInfo.alert = {
            content: this.$t('page_home.msg_info.error_private'),
            type: 'error'
          }
          return
        }
      } else if (this.importInfo.type === '1') {
        if (!this.importInfo.keystore) {
          this.importInfo.alert = {
            content: this.$t('page_home.msg_info.enter_keystore'),
            type: 'error'
          }
          return
        }
        if (!this.importInfo.pwd) {
          this.importInfo.alert = {
            content: this.$t('page_home.msg_info.enter_password'),
            type: 'error'
          }
          return
        }
        try {
          account = this.$web3.eth.accounts.decrypt(this.importInfo.keystore, this.importInfo.pwd)
        } catch (e) {
          console.log('importWalletError', e)
          this.importInfo.alert = {
            content: this.$t('page_home.msg_info.error_password'),
            type: 'error'
          }
          return
        }
      }
      let params = {
        address: account.address,
        tag: this.importInfo.tag || this.$t('page_home.acc') + (this.database.length + 1),
        keystore: this.importInfo.keystore,
        tx_list: [],
        balance: "0"
      }

      this.$web3.eth.getBalance(params.address)
          .then(data => {
              params.balance = data
              this.initAccount(params)
              this.dialogSwitch.import = false
          })
          .catch(console.log )
    },
    //Import End

    // Remove Start
    showRemoveDia:function(currentAcc){
      this.removeAccount=currentAcc;
      this.dialogSwitch.remove=true;
    },
    removeAccountFn:function(){
        this.$db
          .get("czr_accounts")
          .remove({ address: this.removeAccount })
          .write();
        this.$message.success(this.$t('page_home.msg_info.remove_success'))
        this.refresh()
        this.dialogSwitch.remove=false;
    },
    // Remove End
  },
  filters: {
    toEthVal:function(val){
      let tempVal=self.$web3.utils.fromWei(val, 'ether');
      return tempVal;//TODO Keep 4 decimal places
     }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-czr-home {
}
.home-banner {
  width: 100%;
  text-align: center;
  height: 175px;
  background-image: linear-gradient(
    45deg,
    #2d2b5d 0%,
    #4d4d8f 50%,
    #5a59a0 100%
  );
}
.home-banner .icon-logo {
  color: #fff;
  font-size: 80px;
}
.holder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  border: 1px dashed #6ab0df;
  background: #e7f2fa;
  margin-bottom: 10px;
  border-radius: 4px;
}
/* account */
.account-wrap {
  /* padding-top: 64px; */
  margin-top: 40px;
  /* width: 100%; */
  /* background: #1E8FAA; */
  padding: 0 20px;
  margin-left: -20px;
  flex-wrap: wrap;
}
.accounrt-item {
  width: 218px;
  text-align: center;
  border: 1px transparent;
  padding: 44px 10px 10px 10px;
  position: relative;
  margin: 40px 0 20px 20px;
  background-color: #fff;
  cursor: pointer;
  -webkit-user-select: none;
}
.accounrt-item.add-account {
  border: 1px dashed #dddddd;
  padding-top: 24px;
  padding-bottom: 30px;
  /* background: linear-gradient(white,white) padding-box,
    repeating-linear-gradient(-45deg,#ccc 0, #ccc 2px ,white 0,white 8px); */
}
.accounrt-item .account-assets {
  font-size: 24px;
  color: #2d2b5d;
}
/* .accounrt-item .account-avatar{
  position: absolute;
  top: -32px;
  left: 88px;
  width: 64px;
  height: 64px;
  border-radius:50%;
  text-align: center; 
  background-color: #1E8FAA ;
} */
.accounrt-item .account-avatar {
  position: absolute;
  top: -16px;
  left: 86px;
  width: 64px;
  height: 40px;
  background: #4d4d8f;
}
.accounrt-item .account-avatar:before {
  content: "";
  position: absolute;
  top: -16px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 32px solid transparent;
  border-right: 32px solid transparent;
  border-bottom: 16px solid #4d4d8f;
}
.accounrt-item .account-avatar:after {
  content: "";
  position: absolute;
  bottom: -16px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 32px solid transparent;
  border-right: 32px solid transparent;
  border-top: 16px solid #4d4d8f;
}

.accounrt-item .account-avatar .ico-avatar {
  color: #fff;
  font-size: 34px;
  margin-top: -5px;
}
.accounrt-item .delete-acc {
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  color: rgb(204, 204, 204);
}
.accounrt-item .delete-acc:hover {
  color: #2d2b5d;
}
.accounrt-item .account-address {
  max-width: 220px;
  margin-top: 12px;
  color: #9a9c9d;
  table-layout: fixed;
  word-break: break-all;
  overflow: hidden;
}
.accounrt-item .account-cont {
  margin-top: 10px;
}
.accounrt-item .icon-add-acc {
  font-size: 48px;
  color: #9a9c9d;
}
.accounrt-item .add-acc-des {
  color: #9a9c9d;
}

.demo-hist {
  margin-top: 200px;
}
.remove-acc{
  color: #F56C6C;
}

.el-dialog h2 {
    font-weight: 400;
}
.el-dialog .text,
.el-dialog .el-textarea,
.el-dialog .el-alert,
.el-dialog .el-input,
.el-dialog .text{margin-bottom: 10px;}
.el-dialog .el-input  .el-input-group__prepend {
    width: 200px;
}
.import-type-wrap{text-align: center;}
</style>
