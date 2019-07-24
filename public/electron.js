const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const autoUpdater = require('electron-updater').autoUpdater;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;
let webContents = null;
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

  webContents = mainWindow.webContents;

  if (isDev) {
    const os = require('os');
    const { readdirSync } = require('fs');

    const REACT_DEV_TOOL_ID = 'fmkadmapgofadopljbjfkapdkoienihi';
    const REDUX_DEV_TOOL_ID = 'lmhkpmbekcpmknklioeibfkpmmfibljd';

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

    // Open the DevTools.
    //mainWindow.webContents.openDevTools({ mode: 'bottom' });
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('close', e => {
    if (mainWindow) {
      e.preventDefault();
      webContents.send('close');
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

  electron.ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
  });

  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });

  electron.ipcMain.on('check-update', () => {
    autoUpdater.checkForUpdates(false, true);
  });

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking-for-update');
  });

  autoUpdater.on('update-available', () => {
    console.log('A new update is available');
    webContents.send('update-available', 'A new update is available');
  });

  autoUpdater.on('update-not-available', () => {
    console.log('An update is not available');
    webContents.send('update-not-available', 'An update not available');
  });

  autoUpdater.on('download-progress', (bytesPerSecond, percent, total, transferred) => {
    console.log(`${bytesPerSecond}, ${percent}, ${total}, ${transferred}`);
    webContents.send('download-progress', {
      bytesPerSecond: bytesPerSecond,
      percent: percent,
      total: total,
      transferred: transferred
    });
  });

  autoUpdater.on('update-downloaded', event => {
    console.log('update-downloaded');
    console.log(event);
    webContents.send('update-downloaded', 'Update downloaded');
  });

  autoUpdater.on('error', error => {
    console.log('update-error');
    console.error(error);
    webContents.send('update-error', error);
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
          webContents.send('quit');
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
