import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Web3 from 'web3'

//Introducing db database
import db from '../datastore/index'

//Introducing languages that need support
import VueI18n from 'vue-i18n'
import languges from '../../i18n/languges_conf'

Vue.use(VueI18n);
Vue.use(ElementUI);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// javascript lib
let web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    //https://mainnet.infura.io/uIkf4qZgOSqDV0Ir5np1 
    //http://localhost:8545
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/uIkf4qZgOSqDV0Ir5np1"));
}

Vue.web3 = Vue.prototype.$web3 = web3
// web3.eth.net.getNetworkType().then(type => {console.log('NetworkType', type)})
// web3.eth.isSyncing().then(data =>{console.log('isSyncing', data)})

Vue.prototype.$db = db

// Loading i18 language
const messages={};
for(const languge in languges){
    messages[languge]=require("@/i18n/"+languge+".json");
}
//Determine the user's language
let locale =db.get('czr_setting.lang').value() ;
const i18n = new VueI18n({
    locale: locale ,// set locale
    messages,       // set locale messages
});

/* eslint-disable no-new */
Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    i18n,
    render:h=>h(App)
})