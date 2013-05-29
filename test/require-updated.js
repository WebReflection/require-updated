//remove:
var ru = require('../build/require-updated.node.js');
//:remove

wru.test([
  {
    name: "is function",
    test: function () {
      wru.assert(typeof ru == "function");
    }
  },{
    name: 'works with regular modules',
    test: function () {
      wru.assert(require('fs') === ru('fs'));
    }
  },{
    name: 'cache files and auto updates',
    test: function () {
      var fs = ru('fs'),
          tmp1 = '/tmp1.js',
          tmp2 = '/tmp2.js';
      fs.writeFileSync('./' + tmp1, 'module.exports=Math.random()', 'utf-8');
      fs.writeFileSync('./' + tmp2, 'module.exports=Math.random()', 'utf-8');
      // be sure no other things happen to those files, exit current IDLE
      setTimeout(wru.async(function(){
         var  module1 = ru('../' + tmp1),
              module2 = ru('../' + tmp2);
          wru.assert('same result', module1 === ru('../' + tmp1) &&
                                    module2 === ru('../' + tmp2));
          fs.writeFileSync('./' + tmp1, 'module.exports=Math.random()', 'utf-8');
          setTimeout(wru.async(function(){
            var newResult = ru('../' + tmp1);
            wru.assert('file changed so will the result', module1 !== newResult);
            wru.assert('still cache works', newResult === ru('../' + tmp1));
            wru.assert('what was cached still is', module2 === ru('../' + tmp2));
            fs.unlinkSync('./' + tmp1);
            fs.unlinkSync('./' + tmp2);
          }), 1500);
      }), 1500);
    }
  },{
    name: 'nasty oprations outside the module',
    test: function () {
      ru('fs').writeFileSync('./tmp1.js', 'module.exports=Math.random()', 'utf-8');
      var  module1 = ru('../tmp1.js');
      wru.assert('same results', module1 === ru('../tmp1.js'));
      wru.assert('removing the cache', delete require.cache[require.resolve('../tmp1.js')]);
      wru.assert('reloaded', module1 !== ru('../tmp1.js'));
      wru.assert('re-cached', ru('../tmp1.js') === ru('../tmp1.js'));
      ru('fs').unlinkSync('./tmp1.js');
      setTimeout(wru.async(wru.assert), 1500, true);
    }
  }
]);
