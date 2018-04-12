<template>
  <div class="page-setting">
      <div class="setting-banner">
        <div class="setting-center">
          <h1 class="setting-tit">{{ $t('page_setting.tit') }} </h1>
        </div>
      </div>

    <div class="setting-content">
      <form class="bui-form" name="" method="post" action="#" id="">
                <fieldset>
                    <legend>表单标题</legend>
                    <div class="bui-form-item">
                        <label for="" class="bui-label">语言</label>
                        <select id="province" name="province" class="bui-form-selector" v-model="selected" @change="selectVal">

                            <option value="af">Burry (Afrikaans)</option>
                            <option value="sq">shqiptar</option>
                            <option value="am">አማርኛ</option>
                            <option value="ar">عربي</option>
                            <option value="hy">Հայերեն</option>
                            <option value="az">Azərbaycan</option>
                            <option value="eu">Euskal</option>
                            <option value="be">беларускі</option>
                            <option value="bn">বাংলা ভাষার</option>
                            <option value="bs">Bosanski</option>

                            <option value="bg">български</option>
                            <option value="ca">Català</option>
                            <option value="ceb">Sugbo</option>
                            <option value="zh-CN">中文(简体)</option>
                            <option value="zh-TW">中文(繁體)</option>
                            <option value="co">Corsa</option>
                            <option value="hr">Croata</option>
                            <option value="cs">Česky</option>
                            <option value="da">dansk</option>
                            <option value="nl">Nederlands</option>

                            <option value="en">English</option>
                            <option value="eo">Esperanto</option>
                            <option value="et">Eesti keel</option>
                            <option value="fi">suomalainen</option>
                            <option value="fr">Français</option>
                            <option value="fy">Frysk</option>
                            <option value="gl">Galego</option>
                            <option value="ka">ქართული</option>
                            <option value="de">Deutsche Sprache</option>
                            <option value="el">Ελληνικά</option>

                            <option value="gu">ગુજરાતી</option>
                            <option value="ht">Kreyòl Ayisyen</option>
                            <option value="ha">Hausa</option>
                            <option value="haw">Hawaiian</option>
                            <option value="iw">עברית</option>
                            <option value="hi">बात मत करो</option>
                            <option value="hmn">Miao</option>
                            <option value="hu">magyar</option>
                            <option value="is">Íslensku</option>
                            <option value="ig">Asụsụ Ibo</option>

                            <option value="id">Bahasa indonesia</option>
                            <option value="ga">Gaeilge</option>
                            <option value="it">lingua italiana</option>
                            <option value="ja">日本語</option>
                            <option value="jw">Wong Jawa</option>
                            <option value="kn">ಕನ್ನಡ</option>
                            <option value="kk">Қазақша</option>
                            <option value="km">ភាសាខ្មែរ</option>
                            <option value="ko">한국어</option>
                            <option value="ku">Kurdî</option>

                            <option value="ky">Кыргыз тили</option>
                            <option value="lo">ລາວ</option>
                            <option value="la">Latine</option>
                            <option value="lv">Latviešu</option>
                            <option value="lt">Lietuviškai</option>
                            <option value="lb">Lëtzebuergesch</option>
                            <option value="mk">Македонски</option>
                            <option value="mg">Malagasy</option>
                            <option value="ms">Melayu</option>
                            <option value="ml">മലയാളം</option>

                            <option value="mt">Malti</option>
                            <option value="mi">Maori</option>
                            <option value="mr">मराठी</option>
                            <option value="mn">Монгол хэл</option>
                            <option value="my">မြန်မာ</option>
                            <option value="ne">नेपाली</option>
                            <option value="no">norsk språk</option>
                            <option value="ny">Chichewa</option>
                            <option value="ps">پښتو</option>
                            <option value="fa">فارسی</option>

                            <option value="pl">Polski</option>
                            <option value="pt">Português</option>
                            <option value="pa">ਪੰਜਾਬੀ</option>
                            <option value="ro">românesc</option>
                            <option value="ru">Русский язык</option>
                            <option value="sm">Samoa</option>
                            <option value="gd">Gàidhlig na h-Alba</option>
                            <option value="sr">Српски</option>
                            <option value="st">Sesotho</option>
                            <option value="sn">Shinra</option>

                            <option value="sd">سنڌي</option>
                            <option value="si">සිංහල</option>
                            <option value="sk">slovenského jazyk</option>
                            <option value="sl">Slovenščina</option>
                            <option value="so">Somali</option>
                            <option value="es">Español</option>
                            <option value="su">Sunda Indonesian</option>
                            <option value="sw">Kiswahili</option>
                            <option value="sv">Svenska</option>
                            <option value="tl">Filipino</option>

                            <option value="tg">Тоҷикӣ</option>
                            <option value="ta">தமிழ் மொழி</option>
                            <option value="te">తెలుగు</option>
                            <option value="th">ไทย</option>
                            <option value="tr">Türk dili</option>
                            <option value="uk">Українська</option>
                            <option value="ur">اردو</option>
                            <option value="uz">O'zbek</option>
                            <option value="vi">Tiếng Việt</option>
                            <option value="cy">Cymraeg</option>

                            <option value="xh">IsiXhosa saseMzantsi Afrika</option>
                            <option value="yi">ייִדיש</option>
                            <option value="yo">Yorùbá</option>
                            <option value="zu">I-South African Zulu</option>
                            
                            
                            
                            
                            
                
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
      var targetLang=ele.target.value;
      //写入数据库
      this.$db.read().set('czr_contacts.lang',targetLang).write()

      //更新当前语言
      this.$i18n.locale = targetLang;
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
