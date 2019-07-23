const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const autoUpdater = require('electron-updater').autoUpdater;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;
let tray = null;

electron.app.FGM = require('./fgm.node');
console.log('electron.app.FGM', electron.app.FGM);
electron.app.FGM.initialize();

electron.app.LaunchAtLogon = require('./launchAtLogon.node');
console.log('electron.app.LaunchAtLogon', electron.app.LaunchAtLogon);

const width = 500;
const height = 600;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: width,
    minHeight: height,
    // maxWidth: width,
    // maxHeight: height,
    show: false,
    frame: false,
    resizable: true,
    backgroundColor: '#182026',
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true
    }
  });

  mainWindow.setTitle('Frameless Game Mode');
  mainWindow.setMenu(null);

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
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
      BrowserWindow.addDevToolsExtension(`${extensionPath}/${REACT_DEV_TOOL_ID}/${version}`);
    }

    // Redux Dev Tool
    version = readdirSync(`${extensionPath}/${REDUX_DEV_TOOL_ID}`)[0];
    if (version) {
      BrowserWindow.addDevToolsExtension(`${extensionPath}/${REDUX_DEV_TOOL_ID}/${version}`);
    }

    // Mobx Dev Tool
    version = readdirSync(`${extensionPath}/${MOBX_DEV_TOOL_ID}`)[0];
    if (version) {
      BrowserWindow.addDevToolsExtension(`${extensionPath}/${MOBX_DEV_TOOL_ID}/${version}`);
    }

    // Open the DevTools.
    //mainWindow.webContents.openDevTools({ mode: 'bottom' });
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('close', e => {
    if (mainWindow) {
      e.preventDefault();
      mainWindow.send('close');
    } else {
      app.FGM.unInitialize();
      tray.destroy();
    }
  });

  electron.ipcMain.on('closed', () => {
    mainWindow = null;
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });

  if (isDev === false) {
    autoUpdater.checkForUpdates();
  }
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

  app.on('ready', () => {
    createWindow();

    const iconPath = path.join(__dirname, 'appIcon.png');
    tray = new electron.Tray(iconPath);
    const contextMenu = electron.Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          mainWindow.show();
        }
      },
      {
        label: 'Quit Frameless Game Mode',
        click: () => {
          mainWindow.send('quit');
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

  if (isDev === false) {
    const contents = mainWindow.webContents;

    autoUpdater.on('update-available', function() {
      console.log('A new update is available');
      contents.send('updater-message', 'A new update is available');
    });

    autoUpdater.on('checking-for-update', function() {
      console.log('Checking-for-update');
      contents.send('updater-message', 'Checking for Update..');
    });

    autoUpdater.on('error', function(error) {
      console.log('error');
      console.error(error);
      contents.send('updater-message', 'Got Error');
    });

    autoUpdater.on('download-progress', function(bytesPerSecond, percent, total, transferred) {
      console.log(`${bytesPerSecond}, ${percent}, ${total}, ${transferred}`);
      contents.send(
        'updater-message',
        `download progress : ${bytesPerSecond}, ${percent}, ${total}, ${transferred}`
      );
    });

    autoUpdater.on('update-downloaded', function(event) {
      console.log('update-downloaded');
      console.log(event);
      contents.send('updater-message', 'update-downloaded');
    });

    autoUpdater.on('update-not-available', function() {
      console.log('update-not-available');
      contents.send('updater-message', 'update-not-available');
    });
  }
}
