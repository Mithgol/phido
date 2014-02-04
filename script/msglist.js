/* global $, _, msglist:true, phiTitle, phiBar, setup, JAM, beforeSpace */

msglist = function(echotag){ /* jshint indent:false */

phiTitle(echotag + ' - messages');
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
var echobase = JAM( echoPath );

var arrDesc = /-d "([^"]+?)"/.exec(
   setup.areas.group('EchoArea').first(setupEchotag)
);
var echoDesc;
if( arrDesc === null ){
   echoDesc = setupEchotag;
} else {
   echoDesc = arrDesc[1];
}

echobase.readJDX(function(err){
   if( err ) return phiBar.reportErrorHTML([
      _.escapeHTML('' + err)
   ].join(''));

   var baseSize = echobase.size();
   $('#content').html([
      '<table id="msgList" ',
      'class="table table-bordered table-hover table-condensed">',
      '<tbody><tr class="inverse">',
      '<td colspan=5 style="text-align: center;">',
      echoDesc,
      '</td>',
      '</tr><tr class="inverse">',
      '<th>Num</th>',
      '<th>From</th>',
      '<th>To</th>',
      '<th>Subject</th>',
      '<th>Date / time</th>',
      '</tr></tbody></table>'
   ].join(''));
   var $currTBody = $('#msgList tbody:last');
   var currMsg;
   for( currMsg = 1; currMsg <= baseSize; currMsg++ ){
      $(['<tr class="msgRow">',
         '<td>',
            currMsg,
         '</td>',
         '<td class="msgFrom"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgTo"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgSubj"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgDateTime"><i class="fa fa-spinner fa-spin"></i></td>',
      '</tr>'].join('')).appendTo($currTBody);
   }
});

};