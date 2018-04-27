import Datastore from 'lowdb'
import LodashId from 'lodash-id'//Automatically add a unique ID field to each newly added data
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'// Introduce the remote module to run both in the main process and in the renderer process

const languges = require('../../i18n/languges_conf');

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')// Get the electron application's user directory
console.log("PATH", STORE_PATH)

if (process.type !== 'renderer') {
  // If the path does not exist, create one,
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/czr_data.json'))// Initialize lowdb read and write json file name and storage path

// console.log(adapter)

const db = Datastore(adapter)// Lowdb takes over the file
db._.mixin(LodashId)

// Initialize data, pre-specify the basic structure of the database
console.log("是否有czr_accounts", db.read().has('czr_accounts').value())
if (!db.has('czr_accounts').value()) {
  db.set('czr_accounts', []).write()
}

if (!db.has('czr_setting').value()) {
  db.set('czr_setting', {}).write()
  db.set('czr_setting.lang', get_language()).write()
  db.set('czr_setting.lang_conf', languges).write()

}
if (!db.has('czr_contacts').value()) {
  db.set('czr_contacts', {}).write()
}

//Get user browser preference language
function get_language() {
  if (navigator.language) {
    var language = navigator.language;
  } else {
    var language = navigator.browserLanguage;
  }
  return language;
}


export default db