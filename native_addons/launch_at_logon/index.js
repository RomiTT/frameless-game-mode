const LaunchAtLogon = require('./build/Release/launchAtLogon.node');

console.log('launchAtLogon', LaunchAtLogon);

const taskName = 'Frameless Game Mode';
const appPath =
  'D:\\D-Projects\\GitHub\\frameless-game-mode\\dist\\win-unpacked\\Frameless Game Mode.exe';
const appArgs = '--silent';

LaunchAtLogon.initialize();

LaunchAtLogon.set(false, taskName, appPath, appArgs).then(() => {
  LaunchAtLogon.get(taskName).then(result => {
    console.log('FALSE, LaunchAtLogon.get() => ', result);
  });
});

LaunchAtLogon.set(true, taskName, appPath, appArgs).then(() => {
  LaunchAtLogon.get(taskName).then(result => {
    console.log('TRUE, LaunchAtLogon.get() => ', result);
  });
});

module.exports = LaunchAtLogon;
