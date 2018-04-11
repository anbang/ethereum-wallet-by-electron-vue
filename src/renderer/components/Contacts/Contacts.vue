<template>
  <div class="page-contacts">
      <div class="contacts-banner">
        <div class="contacts-center">
          <h1 class="contacts-tit">{{msg}}</h1> 
        </div>
      </div>

        <div class="contacts-content">
            <div class="contacts-wrap b-flex">
                <!-- <template v-for="account in accounts2"> -->
                    <!-- <router-link :to="'/account/' + account.address" tag="div" class="accounrt-item "> -->
                    <div class="contacts-item ">
                        <div class="contacts-avatar">
                          <i class="iconfont ico-avatar">&#xe602;</i>
                        </div>
                        <i class="iconfont delete-contacts">&#xe613;</i>
                        <div class="contacts-cont">
                            <p class="contacts-remark">账号备注信息</p>
                            <p class="contacts-address">account.address</p>
                        </div>  
                    </div>
                                        <div class="contacts-item ">
                        <div class="contacts-avatar">
                          <i class="iconfont ico-avatar">&#xe602;</i>
                        </div>
                        <i class="iconfont delete-contacts">&#xe613;</i>
                        <div class="contacts-cont">
                            <p class="contacts-remark">账号备注信息</p>
                            <p class="contacts-address">account.address</p>
                        </div>  
                    </div>
                                        <div class="contacts-item ">
                        <div class="contacts-avatar">
                          <i class="iconfont ico-avatar">&#xe602;</i>
                        </div>
                        <i class="iconfont delete-contacts">&#xe613;</i>
                        <div class="contacts-cont">
                            <p class="contacts-remark">账号备注信息</p>
                            <p class="contacts-address">account.address</p>
                        </div>  
                    </div>
                                        <div class="contacts-item ">
                        <div class="contacts-avatar">
                          <i class="iconfont ico-avatar">&#xe602;</i>
                        </div>
                        <i class="iconfont delete-contacts">&#xe613;</i>
                        <div class="contacts-cont">
                            <p class="contacts-remark">账号备注信息</p>
                            <p class="contacts-address">account.address</p>
                        </div>  
                    </div>
                                    <!--  ADD  -->
                <div class="contacts-item add-contacts">
                    <div class="contacts-cont">
                      <i class="iconfont icon-add-contacts">&#xe63b;</i>
                      <p class="add-contacts-des">添加联系人</p>
                    </div>  
                </div>

                    <!-- </router-link> -->
              <!-- </template> -->
            </div>
        </div>





    <br><br>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      msg: '联系人'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contacts-banner{  
  height: 175px;
  background-color:#5a59a0 ;
  color: #fff;
  width: 100%;
  -webkit-user-select: none;
  position: relative;
}
.contacts-banner .contacts-tit{
  height: 175px;
  line-height: 175px;
  font-weight: 400;
  font-size: 30px;
}

/* contacts */
.contacts-wrap{
  /* padding-top: 64px; */
  margin-top: 40px;
  /* width: 100%; */
  /* background: #1E8FAA; */
  padding: 0 20px;
  margin-left: -20px;
  flex-wrap:wrap;
}
.contacts-item {
    width: 218px;
    border: 1px transparent;
    padding: 44px 10px 10px 10px;
    position: relative;
    margin: 40px 0 20px 20px;
    background-color: #fff;
    cursor: pointer;
    -webkit-user-select: none;
}
.contacts-item.add-contacts{
  border: 1px dashed #dddddd;
      padding-top: 20px;
  /* background: linear-gradient(white,white) padding-box,
    repeating-linear-gradient(-45deg,#ccc 0, #ccc 2px ,white 0,white 8px); */
}
.contacts-item .contacts-avatar{
  position: absolute;
  top: -32px;
  left: 88px;
  width: 64px;
  height: 64px;
  border-radius:50%;
  text-align: center; 
  background-color: #4d4d8f ;
}


.contacts-item .contacts-avatar .ico-avatar{
  color: #fff;
  font-size: 34px;
  margin-top: 5px;
}
.contacts-item .delete-contacts{
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    color: rgb(204, 204, 204);
}
.contacts-item .delete-contacts:hover{
  color: #2d2b5d;
}
.contacts-item .contacts-address{
    max-width: 220px;
    margin-top: 12px;
    color: #9A9C9D;
    table-layout:fixed; 
    word-break: break-all; 
    overflow:hidden;
}
.contacts-item .icon-add-contacts{
  font-size: 32px;
  color: #9A9C9D ;
}
.contacts-item .add-contacts-des{color: #9A9C9D ;}


</style>
