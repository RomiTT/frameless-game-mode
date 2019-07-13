const { copyFileSync } = require('fs');

let src = './build/Release/launchAtLogon.node';
let dest = '../../public/launchAtLogon.node';

copyFileSync(src, dest);
console.log(`Copied '${src}' to '${dest}'`);
