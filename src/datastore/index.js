import fs from 'fs-extra'
import path from 'path'
// Introduce the remote module to run both in the main process and in the renderer process
import { remote, app } from 'electron'

import Datastore from 'lowdb'
//Automatically add a unique ID field to each newly added data
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'

const languges = require('../../i18n/languges_conf');

// Get the electron application's user directory
const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

//Production mode initialization path
if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

// Initialize lowdb read and write json file name and storage path
const adapter = new FileSync(path.join(STORE_PATH, '/czr_data.json'))

// Lowdb takes over the file
const db = Datastore(adapter)
db._.mixin(LodashId)

// Initialize data, pre-specify the basic structure of the database
if (!db.read().has('czr_accounts').value()) {
  db.set('czr_accounts', []).write()
}
if (!db.has('czr_contacts').value()) {
  db.set('czr_contacts', {}).write()
}
if (!db.has('czr_setting').value()) {
  db.set('czr_setting', {}).write()
  db.set('czr_setting.lang', getLanguage()).write()
  db.set('czr_setting.lang_conf', languges).write()

}

//Get user browser preference language
function getLanguage() {
  if (navigator.language) {
    let language = navigator.language;
  } else {
    let language = navigator.browserLanguage;
  }
  return language;
}


export default db