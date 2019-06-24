const { copyFileSync } = require('fs');

let src = './build/Release/fgm.node';
let dest = '../../public/fgm.node';

console.log(`Copying '${src}' to '${dest}'`);
copyFileSync(src, dest);
