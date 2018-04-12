<template>
  <header class="header b-flex">
      <ul class="header-nav">
          <li><router-link to="/" class="active">{{ $t('model_header.home') }}</router-link></li>
          <li><router-link to="/transfer">{{ $t('model_header.transfer') }}</router-link></li>
          <li><router-link to="/contacts">{{ $t('model_header.contacts') }}</router-link></li>
          <li><router-link to="/setting">{{ $t('model_header.setting') }}</router-link></li>
      </ul>
      <div class="has-assets-czr">
          {{ $t('model_header.total') }}
          <strong>2636578.5483</strong>
          {{ $t('unit.czr') }}
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
.header-nav{width: 70%;text-align: left;}
.has-assets-czr{
    width: 30%;
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

