const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;

electron.app.FGM = require('./fgm.node');
console.log('electron.app.FGM', electron.app.FGM);

electron.app.FGM.initialize();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 620,
    height: 800,
    minWidth: 300,
    minHeight: 400,
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
    app.FGM.unInitialize();
    mainWindow = null;
  });

  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isVisible() === false) mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  let tray = null;
  app.on('ready', () => {
    createWindow();

    const iconPath = path.join(__dirname, 'appIcon.ico');
    tray = new electron.Tray(iconPath);
    const contextMenu = electron.Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          mainWindow.show();
        }
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]);
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
  });

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
}
