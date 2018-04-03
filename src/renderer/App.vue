<template>
  <div id="app">
    <Header></Header>
    <div id="bodyer">
      <!-- <img src="./assets/logo.png" class="czr-logo"> -->
      <router-view/>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'


export default {
  name: 'App',
  components:{Header,Footer}
}
</script>

<style lang='scss'>
@import './assets/css/reset.scss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
#bodyer{min-height: 300px;width: 800px;margin: 0 auto;}
.czr-logo{max-height: 90px;margin-top: 30px;}
</style>
