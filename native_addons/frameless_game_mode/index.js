const FGM = require('./build/Release/fgm.node');

console.log('FGM', FGM);

FGM.getWindowAppList()
  .then(list => {
    console.log('window list = ', list);
  })
  .catch(err => {
    console.log(err);
  });

module.exports = FGM;
