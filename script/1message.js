/* global $, _, singleMessage:true */
/* global phiQ, phiTitle, phiBar, setup, JAM, beforeSpace */
/* will be used: GUI, nwClipboard */

singleMessage = function(echotag, parsedURL){ /* jshint indent:false */

var echobase;

phiTitle(echotag + ' - message');
var lcEchotag = echotag.toLowerCase();

var echoNames = setup.areas.group('EchoArea').names();
var foundNames = echoNames.filter(function(echoName){
   return echoName.toLowerCase() === lcEchotag;
});

if( foundNames.length === 0 ){
   return phiBar.reportErrorHTML([
      'Sorry, the echomail area <b>',
      echotag,
      '</b> is not found on the system.'
   ].join(''));
}

var setupEchotag = foundNames[0];
var echoPath = beforeSpace(
   setup.areas.group('EchoArea').first(setupEchotag)
);
echobase = JAM( echoPath );

var arrDesc = /-d "([^"]+?)"/.exec(
   setup.areas.group('EchoArea').first(setupEchotag)
);
var echoDesc;
if( arrDesc === null ){
   echoDesc = setupEchotag;
} else {
   echoDesc = arrDesc[1];
}

var arrMSGID = parsedURL.optionalParams.filter(function(param){
   return param.name === 'msgid';
}).map(function(param){
   return param.value;
});

var outputSingleMessage = function(MSGID, callback){
   $('#content').append(
      '<p>Stub MSGID output: ' + MSGID + '</p>'
   );
   callback();
};

echobase.readJDX(function(err){
   if( err ) return phiBar.reportErrorHTML( _.escapeHTML('' + err) );

   $('#content').empty();
   arrMSGID.forEach(function(MSGID){
      phiQ.push(function(qNext){
         outputSingleMessage(MSGID, qNext);
      });
   });
   phiQ.start();
});

};