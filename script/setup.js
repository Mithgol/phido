/* global setup:true, initSetup:true */

setup = {};

initSetup = function(){

   var simteconf = require('simteconf');
   var phiConf = simteconf('phido.conf', {
      skipNames: ['//', '#']
   });
   // Read GoldED settings:
   var encodingGED = phiConf.last('EncodingGoldED') || 'utf8';
   var confGED = simteconf(phiConf.last('ConfigGoldED'), {
      encoding: encodingGED,
      skipNames: ['//', '#', '-'+'-']
   });
   setup.UserName =
      phiConf.first('UserName') || confGED.first('UserName') || 'anonymous';
   // Read HPT areas:
   var encodingHPT = phiConf.last('EncodingHPT') || 'utf8';
   setup.areas = simteconf(phiConf.last('AreasHPT'), {
      encoding: encodingHPT,
      skipNames: ['#'],
      lowercase: false,
      prefixGroups: [
         'NetmailArea',
         'BadArea',
         'DupeArea',
         'LocalArea',
         'EchoArea'
      ]
   });

};