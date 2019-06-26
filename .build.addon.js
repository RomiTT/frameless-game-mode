var shell = require('shelljs');
shell.cd('./native_addons/frameless_game_mode');
shell.exec('yarn clean');
shell.exec('yarn build');
shell.cd('../..');
