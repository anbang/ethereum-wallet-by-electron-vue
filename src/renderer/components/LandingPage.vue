<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
        <br>
        <input type="file" id='userImport' enctype="multipart/form-data">
        <input type="button" value="import Account" @click='importAcc'>

        <br> <br>


      <div class="left-side">

        <span class="title">
          Welcome to your new project!
        </span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <p>
            electron-vue comes packed with detailed documentation that covers everything from
            internal configurations, using the project structure, building your application,
            and so much more.
          </p>
          <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
        </div>
        <div class="doc">
          <div class="title alt">Other Documentation</div>
          <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
          <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  const fs = require('fs')

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
        importAcc:function(){
            // alert("open")
            // web3.personal.importRawKey('0xff3d7ee787cE86641264920Baadff8DaaB735A2a')
            //{name: "UTC--2017-11-28T11-59-01.358663700Z--93fce2c3985beb2ab9df590382141479ff159759", path: "/Users/broszhu/Downloads/西溪地址/UTC--2017-11-28T11-5…663700Z--93fce2c3985beb2ab9df590382141479ff159759", lastModified: 1522665488000, lastModifiedDate: Mon Apr 02 2018 18:38:08 GMT+0800 (CST), webkitRelativePath: ""…}
            var userImport=document.getElementById("userImport").files[0];
            var userImportPath=userImport.path;
            console.log(userImportPath);

            fs.readFile(userImportPath,"utf8",function(err,data){
                // 读取文件失败/错误
                if (err) {
                    throw err;
                }
                // 读取文件成功
                var jsonStr=data.toString();
                console.log('utf-8: ',jsonStr, JSON.parse(jsonStr).address);
            });

            // 同步读取
            // var data = fs.readFileSync(userImportPath,"utf-8");
            // console.log("同步读取: " + data.toString());
        }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
