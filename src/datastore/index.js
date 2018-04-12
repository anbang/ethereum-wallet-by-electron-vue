import Datastore from 'lowdb'
import LodashId from 'lodash-id'//为每个新增的数据自动加上一个唯一标识的id字段
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'// 引入remote模块，使其既能跑在main进程也能跑在renderer进程：

const languges = require('../../i18n/languges_conf');

const APP = process.type === 'renderer' ? remote.app : app;// 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath('userData')// 获取electron应用的用户目录
console.log("PATH",STORE_PATH)
// alert('一些本地数据储存在'+STORE_PATH)

if (process.type !== 'renderer') {
    // 如果路径不存在，就创建一个,
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/czr_data.json'))// 初始化lowdb读写的json文件名以及存储路径
// console.log(adapter)

const db = Datastore(adapter)// lowdb接管该文件
db._.mixin(LodashId)

// 初始化数据，预先指定数据库的基本结构
if (!db.has('czr_accounts').value()) {
  db.set('czr_accounts', {}).write()
}
if (!db.has('czr_setting').value()) {
    db.set('czr_setting', {}).write()
    db.set('czr_setting.lang', get_language()).write()//根据语言设置
    //配置各国语言
    db.set('czr_setting.lang_conf', languges).write()//根据语言设置

}
if (!db.has('czr_contacts').value()) {
  db.set('czr_contacts', {}).write()
}

//获取用户浏览器优先选择语言
function get_language() {
  if (navigator.language) {
      var language = navigator.language;
  } else {
      var language = navigator.browserLanguage;
  }
  return language;
}


export default db