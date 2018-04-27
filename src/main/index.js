import { app, BrowserWindow ,Menu} from 'electron'
// import { app, BrowserWindow, Tray, Menu, Notification, clipboard, ipcMain, globalShortcut, dialog } from 'electron'

let menu;
// const path          = require('path');
// const url           = require('url');


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;// Preserve the global reference of a window object

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const winWidth=process.env.NODE_ENV === 'development' ? (810+580) : 810;

app.on('ready', createWindow);// Called when Electron finishes, initializes and prepares to create a browser window. Some APIs can only be used after this event occurs.
app.on('window-all-closed', windowAllClose);// Exit when all windows are closed.
app.on('activate', activateFn);//On OS X, when you click the Dock icon and no other window is open, a window is usually recreated in the application.


function createWindow () {
    // Create browser window
    mainWindow = new BrowserWindow({
        width: winWidth,
        height: 600,
        icon:"./static/icons/logo.png",
        title:"CZR Walleti Default",
        resizable:false,
        fullscreenable:false,
        useContentSize:true
    });

    mainWindow.loadURL(winURL);
    
    // mainWindow.webContents.openDevTools();


    // Fired when the window closes
    mainWindow.on('closed', function () {
        /* 
        Unreferences the window object. If your application supports multiple windows, you will usually store the window in an array. Click Close to remove the corresponding element.
        */
        mainWindow = null
    })

    createMenu()
}

function windowAllClose() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}
function activateFn() {
    if (mainWindow === null) {
        createWindow()
    }
}

//Solve the production environment can not use copy and paste
const createMenu = () => {
    if (process.env.NODE_ENV !== 'development') {
      const template = [{
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click () {
              app.quit()
            }
          }
        ]
      }]
      menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    }
  }

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
