/* global $, _, s, window, msglist:true */
/* global phiTitle, phiBar, phiQ, setup, JAM, beforeSpace, generateAreaURL */

msglist = echotag => { /* jshint indent:false */

var echobase, echoDesc, baseSize, loadingRows, numLastRead;

var fillRowFromHeader = ($msgRow, filledCallback) => {
   echobase.readHeader(+$msgRow.data('number'), (err, header) => {
      if( err ){
         $msgRow.find(
            '.msgFrom, .msgTo, .msgSubj, .msgDateTime'
         ).html('FAIL');
         return filledCallback();
      }
      var decoded = echobase.decodeHeader(header);
      $msgRow.find('.msgFrom').html( _.escape(decoded.from) );
      $msgRow.find('.msgTo').html(   _.escape(decoded.to)   );
      $msgRow.find('.msgSubj').html( _.escape(decoded.subj) );
      $msgRow.find('.msgDateTime').html([
         '<nobr>',
         decoded.origTime[0], '-',
         s.pad(decoded.origTime[1], 2, '0'), '-',
         s.pad(decoded.origTime[2], 2, '0'),
         '</nobr> <nobr>',
         s.pad(decoded.origTime[3], 2, '0'), ':',
         s.pad(decoded.origTime[4], 2, '0'), ':',
         s.pad(decoded.origTime[5], 2, '0'),
         '</nobr>'
      ].join(''));
      if( header.TimesRead < 1 ) $msgRow.addClass('unreadMsg');

      $msgRow.data(
         'URL', generateAreaURL(echotag, decoded)
      ).addClass('hasURL');

      return filledCallback();
   });
};

var lastreadHighlightRow = callback => {
   var $lrRow = $('.lastreadrow');
   var $firstTD = $lrRow.find('td:first');
   $firstTD.html([
      '<span style="white-space: nowrap;">\u25BA ',
      $lrRow.data('number'),
      '</span>'
   ].join(''));
   $.scrollTo($lrRow, {
      'duration': 1000,
      'over': { 'top': -0.5 },
      'onAfter': () => $lrRow.animate(
         { 'background-color': $.Color('#88ffcc') },
         500, () => $lrRow.animate(
            { 'background-color': $.Color('white') },
            500, callback
         )
      )
   });
};

var msghdrDelayedActionQueue = $table => $table.addClass(
   'catchScrollEvents'
).scrollSpy();

var msghdrImmediateActionQueue = $table => $table.css(
   'table-layout', 'auto'
).find('.msgRow').each(function(){
   var $row = $(this);
   phiQ.push( qNext => fillRowFromHeader($row, qNext) );
});

var buildMessageTable = (initialNum, sizeLimit, callback) => {
   var finalMode = false;
   var finalLimit = initialNum + sizeLimit - 1;
   if( finalLimit >= baseSize ){
      finalMode = true;
      finalLimit = baseSize;
   }

   var multipleTables = sizeLimit < baseSize;

   var currTableStart = [
      '<table ',
      'class="msgList table table-bordered table-hover table-condensed"',
      multipleTables ? ' style="table-layout: fixed;"' : '',
      '>',
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
      '</tr>'
   ].join('');
   var currTableEnd = '</tbody></table>';
   var currTBody = '';

   var foundLastRead = false;
   for( var currMsg = initialNum; currMsg <= finalLimit; currMsg++ ){
      var classNamesTR = 'msgRow';
      if( currMsg === numLastRead ){
         foundLastRead = true;
         classNamesTR += ' lastreadrow';
      }
      currTBody += `<tr class="${classNamesTR}" data-number="${currMsg}">` +
         `<td>${currMsg}</td>${loadingRows}</tr>`;
   }

   var $currTable = $( currTableStart + currTBody + currTableEnd );
   $currTable.appendTo('#content');

   phiQ.push(qNext => {
      if( multipleTables ){
         if( !foundLastRead ){
            msghdrDelayedActionQueue( $currTable );
         } else {
            msghdrImmediateActionQueue( $currTable );
            phiQ.push( lastreadHighlightRow );
         }
      }
      if( finalMode ){
         callback();
      } else buildMessageTable(initialNum + sizeLimit, sizeLimit, callback);

      return qNext();
   }).start();
};

var msghdrActionQueue = () => {
   $('.msgList .msgRow').each(function(){
      var $row = $(this);
      phiQ.push( qNext => fillRowFromHeader($row, qNext) );
   }).each(function(){
      var $row = $(this);
      if( +$row.data('number') === numLastRead ){
         $row.addClass('lastreadrow');
         phiQ.push( lastreadHighlightRow );
      }
   });
   phiQ.start();
};

window.msghdrDelayedActionMsgRowProcessor = function(){
   var $row = $(this);
   var $table = $row.closest('table');
   phiQ.push(qNext => {
      if(!( $table.data('inscroll') )) return qNext();

      $table.css('table-layout', 'auto');
      fillRowFromHeader($row, () => {
         $row.addClass('filledFromHeader');
         if( $table.find('.msgRow:not(.filledFromHeader)').length < 1 ){
            $table.off('scrollSpy:exit').off('scrollSpy:enter');
         }
         return qNext();
      });
   });
};

var lcEchotag = echotag.toLowerCase();
var echoNames = setup.areas.group('EchoArea').names();
var foundNames = echoNames.filter(
   echoName => echoName.toLowerCase() === lcEchotag
);

if( foundNames.length === 0 ) return phiBar.reportErrorHTML(
   `Sorry, the echomail area <b>${echotag}</b> is not found on the system.`
);

var setupEchotag = foundNames[0];
var echoPath = beforeSpace(
   setup.areas.group('EchoArea').first(setupEchotag)
);
if( echoPath.toLowerCase() === 'passthrough' ) return phiBar.reportErrorHTML(
   `Sorry, the echomail area <b>${echotag}</b> is passthrough.`
);
echobase = JAM( echoPath );

var arrDesc = /-d "([^"]+?)"/.exec(
   setup.areas.group('EchoArea').first(setupEchotag)
);

if( arrDesc === null ){
   echoDesc = setupEchotag;
   phiTitle(echotag + ' - messages');
} else {
   echoDesc = arrDesc[1];
   phiTitle(echoDesc + ' [' + echotag + '] messages');
}

echobase.readJDX(err => {
   if( err ) return phiBar.reportErrorHTML( _.escape('' + err) );

   baseSize = echobase.size();
   var baseSizeLimit  = 100;
   var largeSizeLimit = 50 * baseSizeLimit;
   if( baseSize <= baseSizeLimit ){
      loadingRows = [
         '<td class="msgFrom"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgTo"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgSubj"><i class="fa fa-spinner fa-spin"></i></td>',
         '<td class="msgDateTime"><i class="fa fa-spinner fa-spin"></i></td>'
      ].join('');
   } else if( baseSize <= largeSizeLimit ){ // do not spin in larger areas
      loadingRows = [
         '<td class="msgFrom"><i class="fa fa-spinner"></i></td>',
         '<td class="msgTo"><i class="fa fa-spinner"></i></td>',
         '<td class="msgSubj"><i class="fa fa-spinner"></i></td>',
         '<td class="msgDateTime"><i class="fa fa-spinner"></i></td>'
      ].join('');
   } else { // do not even populate cells when areas are even larger
      loadingRows = [
         '<td class="msgFrom"></td>',
         '<td class="msgTo"></td>',
         '<td class="msgSubj"></td>',
         '<td class="msgDateTime"></td>'
      ].join('');
   }

   phiBar.loadingMsg("Looking for the last read message's number…");
   echobase.indexLastRead(setup.UserName, (err, idx) => {
      $('#content').html('');
      if( err ){
         numLastRead = null;
      } else {
         numLastRead = idx + 1;
      }
      buildMessageTable(1, baseSizeLimit, () => {
         if( baseSize <= baseSizeLimit ) msghdrActionQueue();
      });
   });
});

};