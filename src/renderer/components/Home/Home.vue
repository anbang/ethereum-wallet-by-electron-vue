<template>
    <div class="page-czr-home">
        <div class="home-banner">
            <i class="iconfont icon-logo">&#xe650;</i>
            <div>
                <button class="bui-button">{{ $t('page_home.import_account') }}</button>
                <button class="bui-button" @click="openFolder">{{ $t('page_home.back_up_account') }}</button>
            </div>
        </div>
        <div class="home-content">
            <div class="account-wrap b-flex">
                <template v-for="account in localAccounts">
                    <router-link :to="'/account/' + account.address" tag="div" class="accounrt-item ">
                        <div class="account-avatar">
                          <i class="iconfont ico-avatar">&#xe602;</i>
                        </div>
                        <i class="iconfont delete-acc">&#xe613;</i>
                        <div class="account-cont">
                            <p class="account-remark">{{account.tag}}</p>
                            <h1 class="account-assets">{{account.balance | ShortVal}}</h1>
                            <p class="account-unit">{{ $t('unit.czr') }}</p>
                            <p class="account-address">{{account.address}}</p>
                        </div>  
                    </router-link>
              </template>
                <!--  ADD  -->
                <div class="accounrt-item add-account" @click="addPwdDiaVisible = true">
                    <div class="account-cont">
                      <i class="iconfont icon-add-acc">&#xe63b;</i>
                      <p class="add-acc-des">{{ $t('page_home.add_account') }}</p>
                    </div>  
                </div>
            </div>
        </div>

        <el-dialog
          :title="$t('page_home.add_prompt')"
          :visible.sync="addPwdDiaVisible"
          width="70%">
          <span>
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="140px" class="demo-ruleForm">
          <el-form-item :label=" $t('page_home.password') " prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label=" $t('page_home.confirm_password') " prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addPwdDiaVisible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="addAccount">{{ $t('confirm') }}</el-button>
          </span>
        </el-dialog>

    </div>

</template>

<script>
import web3 from "@/global/web3.js";
const path = require("path");

//backup
const shell = require("electron").shell;
import { remote, app } from "electron";
const APP = process.type === "renderer" ? remote.app : app;
const STORE_PATH = APP.getPath("userData");
console.log("PATH", STORE_PATH);

const fs = require("fs");

export default {
  name: "Bodyer",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else {
        if (value.length < 9) {
          callback(new Error("At least 9"));
        }
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("Inconsistent password entry twice!"));
      } else {
        callback();
      }
    };
    return {
      addPwdDiaVisible: false,
      ruleForm2: {
        pass: "",
        checkPass: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  filters: {
    ShortVal: function(value) {
      if (!value) return "";
      value = Number(value);
      return value.toFixed(2);
    }
  },
  computed: {
    addressBalance: function(address) {
      var balance = web3.eth.getBalance(address);
      return web3.fromWei(balance, "ether");
    },
    localAccounts: function() {
      var tempAcc = this.$db
        .read()
        .get("czr_accounts")
        .value();
      for (var i = 0; i < tempAcc.length; i++) {
        var current = web3.eth.getBalance(tempAcc[i]["address"]);
        //If the latest balance is different from the local database, update the data;
        if (current != tempAcc[i]["balance"]) {
          this.$db
            .read()
            .get("czr_accounts")
            .find({ address: tempAcc[i]["address"] })
            .assign({ balance: current })
            .write();
        }
        //Converted to user amount
        tempAcc[i]["balance"] = web3.fromWei(tempAcc[i]["balance"], "ether");
      }
      return tempAcc;
    }
  },
  methods: {
    // Backup account
    openFolder: function() {
      shell.showItemInFolder(STORE_PATH + "/accounts");
    },

    //addAccount
    addAccount: function() {
      console.log("22 2", web3);
      var self = this;
      if (
        this.ruleForm2.checkPass >= 9 &&
        this.ruleForm2.pass >= 9 &&
        this.ruleForm2.pass == this.ruleForm2.checkPass
      ) {
        console.log("000");
        web3.personal.newAccount(this.ruleForm2.checkPass, function(e, res) {
          console.log(e, res); //0x2b765eba6de2da0b39365367215f93e563291f49
          var temoObj = {
            tag: "Account Name",
            address: res,
            balance: "0",
            tx_list: []
          };
          self.$db
            .get("czr_accounts")
            .push(temoObj)
            .write();
        });

        this.addPwdDiaVisible = false;
        //TODO Page update new account
      }
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
</style>
