// import Vue from 'vue'
// import axios from 'axios'
//
// import App from './App'
// import router from './router'
// import store from './store'
//
// if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
// Vue.config.productionTip = false
//
// /* eslint-disable no-new */
// new Vue({
//   components: { App },
//   router,
//   store,
//   template: '<App/>'
// }).$mount('#app')
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import Vue from 'vue'
import VueI18n from 'vue-i18n'

import App from './App'
import router from './router'
import store from './store'

//引入db数据库
import db from '../datastore/index'

Vue.prototype.$db = db
Vue.config.productionTip = false

Vue.use(VueI18n);
// 加载i18语言
const messages = {
    'zh-CN': require('@/i18n/zh.json'),
    'ca': require('@/i18n/tap-i18n.json'),
    'de': require('@/i18n/tap-i18n.json'),
    'es': require('@/i18n/tap-i18n.json'),
    'en': require('@/i18n/tap-i18n.json'),
    'fa': require('@/i18n/tap-i18n.json'),

    'fr': require('@/i18n/tap-i18n.json'),
    'ja': require('@/i18n/tap-i18n.json'),
    'ko': require('@/i18n/tap-i18n.json'),
    'pt': require('@/i18n/tap-i18n.json'),
    'ro': require('@/i18n/tap-i18n.json'),

    'ru': require('@/i18n/tap-i18n.json'),
    'sq': require('@/i18n/tap-i18n.json'),
    'ua': require('@/i18n/tap-i18n.json'),
    'zh-TW': require('@/i18n/zh-TW.json'),
    'zh': require('@/i18n/zh.json')
};

//判断用户使用的语言
var locale =db.get('czr_contacts.lang').value() ;
// store.state.Counter.lang = db.get('czr_contacts.lang').value() ;
// console.log(store.state.Counter.lang)
//生成国际化插件实例
const i18n = new VueI18n({
    locale: store.state.Counter.lang, // set locale
    messages, // set locale messages
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render:h=>h(App)
})