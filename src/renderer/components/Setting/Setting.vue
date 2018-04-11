<template>
  <div class="page-setting">
      <div class="setting-banner">
        <div class="setting-center">
          <h1 class="setting-tit">{{msg}} {{selected}} </h1>
        </div>
      </div>

    <div class="setting-content">
      <form class="bui-form" name="" method="post" action="#" id="">
                <fieldset>
                    <legend>表单标题</legend>
                    <div class="bui-form-item">
                        <label for="" class="bui-label">语言</label>
                        <select id="province" name="province" class="bui-form-selector" v-model="selected" @change="selectVal">
                            <option value="English">English</option>
                            <option value="zh-CN">简体中文</option>
                            <option value="ca">Catalana</option>
                            <option value="de">German</option>
                            <option value="es">Spanish</option>
                            <option value="en">English</option>
                            <option value="fa">Farsi</option>
                            <option value="fr">French</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="pt">Portuguese</option>
                            <option value="ro">Romanian</option>
                            <option value="ru">Russian</option>
                            <option value="sq">Albanian</option>
                            <option value="ua">Tiếng Việt</option>
                            <option value="zh-TW">繁体中文</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>

                    <span v-text="$t('lang.browse')"></span>
                    <p>{{ $t('lang.browse') }}</p> 
                </fieldset>
            </form>
    </div>
  </div>

  
</template>

<script>
export default {
  name: 'Setting',
  data () {
    return {
      msg: 'setting',
      selected: this.$db.get('czr_contacts.lang').value()
    }
  },
  methods:{
    selectVal:function (ele){
      console.log(ele.target.value,this)
      this.$db.read().set('czr_contacts.lang',ele.target.value).write()
      window.location.reload();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.setting-banner{  
  height: 175px;
  background-color:#5a59a0 ;
  color: #fff;
  width: 100%;
  -webkit-user-select: none;
  position: relative;
}
.setting-banner .setting-tit{
  height: 175px;
  line-height: 175px;
  font-weight: 400;
  font-size: 30px;
}
.setting-content{text-align: left;margin-top: 38px;}
</style>
