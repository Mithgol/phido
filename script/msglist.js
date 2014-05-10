/* global $, _, msglist:true */
/* global phiTitle, phiBar, phiQ, setup, JAM, beforeSpace, generateAreaURL */

msglist = function(echotag){ /* jshint indent:false */

var echobase, baseSize, loadingRows, numLastRead;

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
         '<td class="msgNum">' + $msgRow.data('number') + '</td>',
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
      if( header.TimesRead < 1 ) $msgRow.addClass('unreadMsg');

      $msgRow.data(
         'msgURL', generateAreaURL(echotag, decoded)
      ).addClass('hasMsgURL');

      filledCallback();
   });
};

var lastreadHighlightRow = function($lrRow, callback){
   var $firstTD = $lrRow.find('td:first');
   $firstTD.html([
      '<span style="white-space: nowrap;">\u25BA ',
      $lrRow.data('number'),
      '</span>'
   ].join(''));
   $.scrollTo($lrRow, {
      'duration': 1000,
      'over': { 'top': -0.5 },
      'onAfter': function(){
         $lrRow.animate({
            'background-color': $.Color('#88ffcc')
         }, 500, function(){
            $lrRow.animate({
               'background-color': $.Color('white')
            }, 500, callback);
         });
      }
   });
};

var buildMessageTable = function(initialNum, sizeLimit, callback){
   var currMsg, $currTBody;

   var finalMode = false;
   var finalLimit = initialNum + sizeLimit - 1;
   if( finalLimit >= baseSize ){
      finalMode = true;
      finalLimit = baseSize;
   }

   $currTBody = $([
      '<table ',
      'class="msgList table table-bordered table-hover table-condensed">',
      '<tbody><tr class="inverse">',
      '<td colspan=5 style="text-align: center;">',
      echoDesc,
      '</td>',
      '</tr><tr class="inverse">',
      '<th style="text-align: right;">Num</th>',
      '<th>From</th>',
      '<th>To</th>',
      '<th>Subject</th>',
      '<th>Date / time</th>',
      '</tr></tbody></table>'
   ].join('')).appendTo('#content').find('tbody:last');

   var $rowLastRead = null;
   for( currMsg = initialNum; currMsg <= finalLimit; currMsg++ ){
      var $currRow = $(['<tr class="msgRow">',
         '<td>',
            currMsg,
         '</td>',
         loadingRows,
      '</tr>'].join('')).data({
         'number': currMsg
      }).appendTo($currTBody);

      if( currMsg === numLastRead ) $rowLastRead = $currRow;
   }

   phiQ.push(function(qNext){
      if( sizeLimit <= baseSize ){
         if( $rowLastRead === null ){
            msghdrDelayedActionQueue( $currTBody.closest('.msgList') );
         } else {
            msghdrImmediateActionQueue( $currTBody.closest('.msgList') );
            phiQ.push(function(qNext){
               lastreadHighlightRow($rowLastRead, qNext);
            });
         }
      }
      if( finalMode ){
         callback();
      } else {
         buildMessageTable(initialNum + sizeLimit, sizeLimit, callback);
      }
      qNext();
   }).start();
};

var msghdrActionQueue = function(){
   $('.msgList .msgRow').each(function(){
      var $row = $(this);
      phiQ.push(function(qNext){
         fillRowFromHeader($row, qNext);
      });
   }).each(function(){
      var $row = $(this);
      if( $row.data('number') === numLastRead ){
         phiQ.push(function(qNext){
            lastreadHighlightRow($row, qNext);
         });
      }
   });
   phiQ.start();
};

var msghdrDelayedActionQueue = function($table){
   $table.on('scrollSpy:exit', function(){
      $(this).data('inscroll', false);
   }).on('scrollSpy:enter', function(){
      $(this).data('inscroll', true).find('.msgRow').each(function(){
         var $row = $(this);
         phiQ.push(function(qNext){
            if( ! $table.data('inscroll') ){
               qNext();
               return;
            }
            fillRowFromHeader($row, function(){
               $row.addClass('filledFromHeader');
               if( $table.find('.msgRow:not(.filledFromHeader)').length < 1 ){
                  $table.off('scrollSpy:exit').off('scrollSpy:enter');
               }
               qNext();
            });
         });
      });
      phiQ.start();
   }).scrollSpy();
};

var msghdrImmediateActionQueue = function($table){
   $table.find('.msgRow').each(function(){
      var $row = $(this);
      phiQ.push(function(qNext){
         fillRowFromHeader($row, qNext);
      });
   });
};

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
   phiTitle(echotag + ' - messages');
} else {
   echoDesc = arrDesc[1];
   phiTitle(echoDesc + ' [' + echotag + '] messages');
}

echobase.readJDX(function(err){
   if( err ) return phiBar.reportErrorHTML( _.escapeHTML('' + err) );

   baseSize = echobase.size();
   var baseSizeLimit = 200;
   if( baseSize <= baseSizeLimit ){
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

   phiBar.loadingMsg("Looking for the last read message's number…");
   echobase.indexLastRead(setup.UserName, function(err, idx){
      $('#content').html('');
      if( err ){
         numLastRead = null;
      } else {
         numLastRead = idx + 1;
      }
      buildMessageTable(1, baseSizeLimit, function(){
         if( baseSize <= baseSizeLimit ) msghdrActionQueue();
      });
   });
});

};