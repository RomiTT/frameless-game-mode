const { remote, shell, ipcRenderer } = require('electron');

interface IAutoUpdaterDownloadProgress {
  bytesPerSecond: number;
  percent: number;
  total: number;
  transferred: number;
}

const AutoUpdater = {
  checkUpdate: () => {
    ipcRenderer.send('check-update');
  },
  downloadUpdate: () => {
    ipcRenderer.send('download-update');
  },
  installUpdate: () => {
    ipcRenderer.send('install-update');
  },
  onUdateAvailable: (handler: (event: any, msg: string) => void) => {
    ipcRenderer.on('update-available', handler);
  },
  onUpdateNotAvailable: (handler: (event: any, msg: string) => void) => {
    ipcRenderer.on('update-not-available', handler);
  },
  onDownloadProgress: (handler: (event: any, progress: IAutoUpdaterDownloadProgress) => void) => {
    ipcRenderer.on('download-progress', handler);
  },
  onUpdateDownloaded: (handler: (event: any, msg: string) => void) => {
    ipcRenderer.on('update-downloaded', handler);
  },
  onError: (handler: (event: any, error: any) => void) => {
    ipcRenderer.on('update-error', handler);
  },
  removeUpdateAvailableListener: (handler: Function) => {
    ipcRenderer.removeListener('update-available', handler);
  },
  removeUpdateNotAvailableListener: (handler: Function) => {
    ipcRenderer.removeListener('update-not-available', handler);
  },
  removeDownloadProgressListener: (handler: Function) => {
    ipcRenderer.removeListener('download-progress', handler);
  },
  removeUpdateDownloadedListener: (handler: Function) => {
    ipcRenderer.removeListener('update-downloaded', handler);
  },
  removeErrorHandler: (handler: Function) => {
    ipcRenderer.removeListener('update-error', handler);
  }
};

export default AutoUpdater;
