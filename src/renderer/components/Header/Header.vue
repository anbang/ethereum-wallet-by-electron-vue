<template>
  <header class="header b-flex">
      <ul class="header-nav">
          <li><router-link to="/" class="active">首页</router-link></li>
          <li><router-link to="/transfer">转账</router-link></li>
          <li><router-link to="/contacts">联系人</router-link></li>
          <li><router-link to="/setting">设置</router-link></li>
      </ul>
      <div class="has-assets-czr">
          合计持有
          <strong>2636578.5483</strong>
          CZR
      </div>
  </header>

</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      logo: "canonchain"
    };
  }
};
</script>

<style scoped>
.header {
  padding: 12px 20px;
  /* background-color: #f4f4f4; */
}
.header-nav{width: 50%;text-align: left;}
.has-assets-czr{
    width: 50%;
    text-align: right;
    font-size: 16px;
}
.header-nav > li {
  display: inline-block;
  font-size: 16px;
  margin-right: 30px;
  color: #34495e;
}
.header-nav a{color: #34495e;text-decoration: none;display: inline-block;}
.header-nav a:hover{color: #2d2b5d;}
.header-nav a.router-link-exact-active{border-bottom: 3px solid #2d2b5d;}

</style>

