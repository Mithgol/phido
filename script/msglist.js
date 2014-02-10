/* global $, _, msglist:true */
/* global phiTitle, phiBar, phiQ, setup, JAM, beforeSpace */

msglist = function(echotag){ /* jshint indent:false */

var fillRowFromHeader = function($msgRow, filledCallback){
   echobase.readHeader($msgRow.data('number'), function(err, header){
      if( err ){
         $msgRow.find(
            '.msgFrom, .msgTo, .msgSubj, .msgDateTime'
         ).html('FAIL');
         filledCallback();
         return;
      }
      var decoded = echobase.decodeHeader(header);
      $msgRow.html([
         '<td>' + $msgRow.data('number') + '</td>',
         '<td class="msgFrom">' + _.escapeHTML(decoded.from) + '</td>',
         '<td class="msgTo">' + _.escapeHTML(decoded.to) + '</td>',
         '<td class="msgSubj">' + _.escapeHTML(decoded.subj) + '</td>',
         '<td class="msgDateTime"><nobr>',
         decoded.origTime[0], '-',
         _(decoded.origTime[1]).pad(2, '0'), '-',
         _(decoded.origTime[2]).pad(2, '0'),
         '</nobr> <nobr>',
         _(decoded.origTime[3]).pad(2, '0'), ':',
         _(decoded.origTime[4]).pad(2, '0'), ':',
         _(decoded.origTime[5]).pad(2, '0'),
         '</nobr></td>'
      ].join(''));
      filledCallback();
   });
};

var msghdrActionQueue = function(){
   $('.msgList .msgRow').each(function(){
      var $row = $(this);
      phiQ.push(function(qNext){
         fillRowFromHeader($row, qNext);
      });
   });
};

var msghdrDelayedActionQueue = function(){
   $('.msgList .msgRow').each(function(){
      var $row = $(this);
      $row.on('scrollSpy:exit', function(){
         $(this).data('inscroll', false);
      }).on('scrollSpy:enter', function(){
         $(this).data('inscroll', true);
         phiQ.push(function(qNext){
            if( ! $row.data('inscroll') ){
               qNext();
               return;
            }
            fillRowFromHeader($row, function(){
               $row.off('scrollSpy:exit').off('scrollSpy:enter');
               qNext();
            });
         }).start();
      });
   }).scrollSpy();
};

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
   if( err ) return phiBar.reportErrorHTML( _.escapeHTML('' + err) );

   var baseSize = echobase.size();
   var loadingRows;
   if( baseSize <= 250 ){
      loadingRows = [
         '<td class="msgFrom"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgTo"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgSubj"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgDateTime"><i class="fa fa-spinner fa-spin"></i></td>'
      ].join('');
   } else { // do not spin in larger areas
      loadingRows = [
         '<td class="msgFrom"><i class="fa fa-spinner"></i></td>',
         '<td class="msgTo"><i class="fa fa-spinner"></i></td>',
         '<td class="msgSubj"><i class="fa fa-spinner"></i></td>',
         '<td class="msgDateTime"><i class="fa fa-spinner"></i></td>'
      ].join('');
   }

   $('#content').html('');
   var currMsg, $currTBody;
   for( currMsg = 1; currMsg <= baseSize; currMsg++ ){
      if( currMsg % 500 === 1 ){
         $currTBody = $([
            '<table class=',
            '"msgList table table-bordered table-hover table-condensed">',
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
         ].join('')).appendTo('#content').find('tbody:last');
      }
      $(['<tr class="msgRow">',
         '<td>',
            currMsg,
         '</td>',
         loadingRows,
      '</tr>'].join('')).data({
         'number': currMsg
      }).appendTo($currTBody);
   }

   if( baseSize <= 250 ){
      msghdrActionQueue();
   } else {
      msghdrDelayedActionQueue();
   }
   phiQ.start();
});

};