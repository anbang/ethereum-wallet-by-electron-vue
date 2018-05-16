<template>
  <div class="page-setting">
      <div class="setting-banner">
        <div class="setting-center">
          <h1 class="setting-tit">{{ $t('page_setting.tit') }} </h1>
        </div>
      </div>
    <div class="setting-content">
            <div class="selected-wrap">
              <span>{{ $t('page_setting.lang') }} </span>
              <el-select v-model="value" @change="selectVal">
                <el-option
                  v-for="item in langOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Setting",
  data() {
    return {
      value: this.$db.get("czr_setting.lang").value()
    };
  },
  computed: {
    langOptions: function() {
      let langs = this.$db.get("czr_setting.lang_conf").value();
      let tempOption = [];
      for (const lang in langs) {
        tempOption.push({
          value: lang,
          label: langs[lang]
        });
      }
      return tempOption;
    }
  },
  methods: {
    selectVal: function(val) {
      //Write to the database
      this.$db
        .read()
        .set("czr_setting.lang", val)
        .write();
      //Update current language
      this.$i18n.locale = val;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.setting-banner {
  height: 175px;
  background-color: #5a59a0;
  color: #fff;
  width: 100%;
  -webkit-user-select: none;
  position: relative;
}
.setting-banner .setting-tit {
  height: 175px;
  text-align: center;
  line-height: 175px;
  font-weight: 400;
  font-size: 30px;
}
.setting-content {
  text-align: left;
  margin-top: 38px;
}
.selected-wrap {
  text-align: center;
}
/* .lang-label{padding-top: 6px;} */
</style>
