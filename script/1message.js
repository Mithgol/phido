/* global $, _, singleMessage:true */
/* global phiTitle, phiBar, setup, JAM, beforeSpace */
/* will be used: phiQ, GUI, nwClipboard */

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

echobase.readJDX(function(err){
   if( err ) return phiBar.reportErrorHTML( _.escapeHTML('' + err) );

   $('#content').html(
      'Stub function looking for the following MSGID(s):<br>'+
      arrMSGID.map(function(MSGID){
         return _.escapeHTML(MSGID);
      }).join('<br>')
   );
});

};