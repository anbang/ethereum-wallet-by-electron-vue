<template>
  <footer class="footer">
      {{copyright}}
  </footer>

</template>

<script>
export default {
  name:"Footer",
  data(){
      return{
          copyright:"Power By CANONCHAIN"
      }
  }
}
</script>

<style scoped>
.footer{color: #888;width: 100%;text-align: center;padding:10px 0;background-color: #f4f4f4;}
ul{list-style: none;}
ul>li{display: inline-block;font-size: 18px;}
</style>

