const { copyFileSync } = require('fs');

let src = './build/Release/fgm.node';
let dest = '../../public/fgm.node';

copyFileSync(src, dest);
console.log(`Copied '${src}' to '${dest}'`);
