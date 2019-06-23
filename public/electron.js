const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true
    }
  });

  mainWindow.setTitle('');

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    const os = require('os');
    const { readdirSync } = require('fs');

    const REACT_DEV_TOOL_ID = 'fmkadmapgofadopljbjfkapdkoienihi';
    const REDUX_DEV_TOOL_ID = 'lmhkpmbekcpmknklioeibfkpmmfibljd';
    const MOBX_DEV_TOOL_ID = 'pfgnfdagidkfgccljigdamigbcnndkod';

    const extensionPath = path.join(
      os.homedir(),
      '/AppData/Local/Google/Chrome/User Data/Default/Extensions'
    );

    // React Dev Tool
    var version = readdirSync(`${extensionPath}/${REACT_DEV_TOOL_ID}`)[0];
    if (version) {
      BrowserWindow.addDevToolsExtension(
        `${extensionPath}/${REACT_DEV_TOOL_ID}/${version}`
      );
    }

    // Redux Dev Tool
    version = readdirSync(`${extensionPath}/${REDUX_DEV_TOOL_ID}`)[0];
    if (version) {
      BrowserWindow.addDevToolsExtension(
        `${extensionPath}/${REDUX_DEV_TOOL_ID}/${version}`
      );
    }

    // Mobx Dev Tool
    version = readdirSync(`${extensionPath}/${MOBX_DEV_TOOL_ID}`)[0];
    if (version) {
      BrowserWindow.addDevToolsExtension(
        `${extensionPath}/${MOBX_DEV_TOOL_ID}/${version}`
      );
    }

    // Open the DevTools.
    //mainWindow.webContents.openDevTools({ mode: 'bottom' });
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
