<template>
  <header class="header">
      <!-- <h2 class="header-tit">{{logo}}.com</h2> -->
      <ul>
          <li><router-link to="/"><i class="iconfont">&#xe60d;</i> 首页</router-link></li>
          <!-- <li><router-link to="/account"><i class="iconfont">&#xe60a;</i>账号</router-link></li> -->
          <!-- <li><router-link to="/search"><i class="iconfont">&#xe60a;</i>转账</router-link></li> -->
          <li><router-link to="/transfer"><i class="iconfont">&#xe60a;</i>转账</router-link></li>
          <li><router-link to="/setting"><i class="iconfont">&#xe78a;</i>设置</router-link></li>
      </ul>
  </header>

</template>

<script>
export default {
  name:"Header",
  data(){
      return{
          logo:"canonchain"
      }
  }
}
</script>

<style scoped>
.header{color: #888;width: 100%;text-align: center;padding:10px 0;background-color: #f4f4f4;}
.header-tit{text-align: center;}
ul{list-style: none;}
ul>li{display: inline-block;font-size: 18px;margin-right:20px;}
ul>li .iconfont{margin-right: 4px;}
</style>

