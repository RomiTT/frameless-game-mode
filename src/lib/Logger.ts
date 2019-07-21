const isDev = require('electron-is-dev');

const Logger = {
  log: function(message?: any, ...optionalParams: any[]) {
    if (isDev) {
      const date = new Date();
      const timedMessage = `[${date.toISOString()}] ${message}`;
      const args: any = [timedMessage, ...optionalParams];
      console.log.apply(console, args);
    }
  },

  logRenderInfo: (renderer: object) => {
    if (isDev) {
      Logger.log(`${renderer.constructor.name}.render()`);
    }
  }
};

export default Logger;
