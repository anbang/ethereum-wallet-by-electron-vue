<template>
  <div class="page-account-detail">
    <div class="account-banner">
      <div class="acc-interactive qrcode-wrap">
        <i class="iconfont icon-qrcode">&#xe628;</i>
        <p class="icon-des">二维码</p>
      </div>
      <router-link :to="'/transfer?account=' + currentAcc" tag="div"  class="acc-interactive transfer-wrap">
              <i class="iconfont icon-transfer">&#xe605;</i>
          <p class="icon-des">发起转账</p>
      </router-link>
      <div class="account-center">
        <div class="account-alias-wrap">
          <span class="text-sub-color">账号备注信息</span>
          <i class="iconfont icon-edit-alias"> &#xe604; </i>
        </div>
        <div class="account-has-assets">
          <h1 class="account-assets">{{accBalance}}</h1>
          <span>CZR</span>
        </div>
        <div class="account-address-wrap">
          <span class="text-sub-color">{{ currentAcc }}</span>
          <i class="iconfont icon-address-copy"> &#xe645; </i>
        </div>
      </div>
    </div>
    <div class="account-content">
      <h2 class="transfer-tit">交易记录</h2>
      <div class="transfer-log">
        <template v-for="item in transList">
            <div v-if="item.to == currentAcc">
              <div   class="transfer-item b-flex b-flex-justify plus-assets">
                <div class="icon-wrap">
                  <i class="iconfont icon-transfer">&#xe639;</i>
                </div>
                <div class="transfer-info">
                  <p class="by-address">{{item.from}}</p>
                  <p class="transfer-time">02 / 27 /2018</p>
                </div>
                <div class="transfer-assets">
                  <div class="assets">+ {{item.value | toCZR }} CZR</div>
                </div>
              </div>
            </div>

            <div v-if="item.from == currentAcc">
                  <div class="transfer-item b-flex b-flex-justify less-assets">
                  <div class="icon-wrap">
                    <i class="iconfont icon-transfer">&#xe638;</i>
                  </div>
                  <div class="transfer-info">
                    <p class="by-address">{{item.to}}</p>
                    <p class="transfer-time">02 / 27 /2018</p>
                  </div>
                  <div class="transfer-assets">
                    <div class="assets">- {{item.value | toCZR }} CZR</div>
                  </div>
                </div>
            </div>
        </template>
      </div>
      
      <!--  无交易记录  -->
      <div v-if="transList.length==0" class="no-transfer-log">
        <i class="iconfont">&#xe6e7;</i>
        <p>暂无交易记录</p>
      </div>
    </div>

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
      currentAcc:this.$route.params.id
    }
  },
  filters:{
    toCZR:function(val){
      return web3.fromWei(val,"ether");
    }
  },
  computed:{
    accBalance:function(){
      var balaceWei = web3.eth.getBalance(this.currentAcc).toNumber();
      var balaceVal = web3.fromWei(balaceWei, 'ether')
      return balaceVal;
    },
    transList:function(){
        var tx_list = this.$db.read().get('czr_accounts').find({address:this.currentAcc}).get('tx_list').value();

        return tx_list;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.account-banner{
  height: 175px;
  background-color:#5a59a0 ;
  color: #fff;
  width: 100%;
  /* -webkit-user-select: none; */
  position: relative;
}

.account-banner .qrcode-wrap{position: absolute;top: 10px;right: 20px;color: #bfbef8;}
.account-banner .transfer-wrap{position: absolute;top: 10px;right: 80px;color: #bfbef8;}
.account-banner .qrcode-wrap:hover {color: #e7e7ff;}
.account-banner .qrcode-wrap:hover .icon-des{color: #e7e7ff;}
.account-banner .transfer-wrap:hover {color: #e7e7ff;}
.account-banner .transfer-wrap:hover .icon-des{color: #e7e7ff;}

.account-banner .acc-interactive:hover {cursor: pointer;}
.account-banner .acc-interactive .iconfont{font-size: 18px;}
.account-banner .icon-des {font-size: 12px;color: #bfbef8;}

.account-banner .account-center .iconfont{color: #c4c3f7;cursor: pointer;width: 24px;height: 24px;}
.account-banner .account-center .iconfont:hover{color: #e7e7ff;}
.account-center{padding-top: 38px;}
.account-has-assets {margin: 10px 0 15px;}
.account-has-assets .account-assets{font-size: 24px;display: inline-block;}

.account-content{text-align: left;padding: 0 20px;margin-top: 40px;}
.account-content .transfer-tit{font-size: 18px;font-weight: 400;}

/* 交易记录 */
.account-content .no-transfer-log {text-align: center;color: #9B9B9B;}
.account-content .no-transfer-log .iconfont{font-size: 128px;}
.account-content .transfer-log{margin-top: 22px;}

.transfer-log .transfer-item{background-color: #fff;padding: 10px 15px;margin-bottom: 2px;
  cursor: pointer;-webkit-user-select: none;}
.account-content .transfer-log .transfer-info{width: 300px;text-align: left;}
.transfer-log .icon-wrap{width: 42px;height: 42px;border-radius: 50%;}
.transfer-log .icon-wrap .icon-transfer{color: #fff;position: relative;left: 11px;top: 4px;font-size: 20px;}
.transfer-log .plus-assets .icon-wrap{background-color: rgba(0, 128, 0, 0.555);}
.transfer-log .less-assets .icon-wrap{background-color: rgba(255, 153, 0, 0.555);}
.transfer-log .by-address{color: rgb(54, 54, 54);}
.transfer-log .transfer-time{color: rgb(161, 161, 161);}
.transfer-log .transfer-assets .assets{font-size: 18px;height: 42px;line-height: 42px;width: 300px;text-align: right;}
.plus-assets .assets{color: green;}
.less-assets .assets{color: rgb(255, 51, 0);}


</style>
