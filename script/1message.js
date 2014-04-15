/* global $, _, singleMessage:true */
/* global phiQ, phiTitle, phiBar, setup, JAM, beforeSpace, FidoHTML */
/* will be used: GUI, nwClipboard */

singleMessage = function(echotag, parsedURL){ /* jshint indent:false */

var echobase;

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
   phiTitle(echotag + ' - message');
} else {
   echoDesc = arrDesc[1];
   phiTitle(echoDesc + ' [' + echotag + '] messages');
}

var arrMSGID = parsedURL.optionalParams.filter(function(param){
   return param.name === 'msgid';
}).map(function(param){
   return param.value;
});

var outputMessageText = function($message, header, callback){
   echobase.decodeMessage(header, function(error, messageText){
      $message.find('.messageText').html(
         error ? _.escapeHTML('' + error) : FidoHTML.fromText(messageText)
      );
      callback();
   });
};

var outputSingleMessage = function(header, callback){
   var decoded = echobase.decodeHeader(header);
   header.decoded = decoded;
   var $curr = $(['<table class="table table-bordered table-condensed">',
      '<tr>',
         '<th rowspan=4 class="avatar">',
            '<div style="width: 140px;">',
               '&nbsp;',
            '</div>',
         '</th>',
         '<th class="inverse">Msg</th>',
         '<td colspan=3>',
            header.MessageIndex + ' of ' + echobase.size(),
         '</td>',
      '</tr>',
      '<tr>',
         '<th class="inverse">From</th>',
         '<td width="100%">',
            decoded.from || '',
         '</td>',
         '<td width=1>',
            decoded.origAddr || '<i class="fa fa-spinner fa-spin"></i>',
         '</td>',
         '<td>',
            '<nobr>',
               decoded.origTime[0], '-',
               _(decoded.origTime[1]).pad(2, '0'), '-',
               _(decoded.origTime[2]).pad(2, '0'),
            ' ',
               _(decoded.origTime[3]).pad(2, '0'), ':',
               _(decoded.origTime[4]).pad(2, '0'), ':',
               _(decoded.origTime[5]).pad(2, '0'),
            '</nobr>',
         '</td>',
      '</tr>',
      '<tr>',
         '<th class="inverse">To</th>',
         '<td>' + (decoded.to     ||'') + '</td>',
         '<td width=1>' + (decoded.toAddr ||'') + '</td>',
         '<td>',
            '<nobr>',
               decoded.procTime[0], '-',
               _(decoded.procTime[1]).pad(2, '0'), '-',
               _(decoded.procTime[2]).pad(2, '0'),
            ' ',
               _(decoded.procTime[3]).pad(2, '0'), ':',
               _(decoded.procTime[4]).pad(2, '0'), ':',
               _(decoded.procTime[5]).pad(2, '0'),
            '</nobr>',
         '</td>',
      '</tr>',
      '<tr>',
         '<th class="inverse">Subj</th>',
         '<td colspan=3>',
            decoded.subj || '',
         '</td>',
      '</tr>',
      '<tr>',
         '<td colspan=5 class="messageText">',
            '<p style="text-align: center;">',
               '<i class="fa fa-spinner fa-spin"></i>',
            '</p>',
         '</td>',
      '</tr>',
   '</table>'].join('')).appendTo('#content');
   $curr.find('.avatar').each(function(){
      var $avatar = $(this);
      var height = $avatar.height();
      $avatar.find('div').width( height+1 );
      $avatar.css('background-image', 'url(' +
         'https://secure.gravatar.com/avatar/?f=y&d=mm&s=' + height +
      ')');
   });
   phiQ.push(function(qNext){
      outputMessageText($curr, header, qNext);
   });
   callback();
};

echobase.headersForMSGID(arrMSGID, function(err, headers){
   if( err ) return phiBar.reportErrorHTML( _.escapeHTML('' + err) );

   $('#content').empty();
   if( headers.length < 1 ){
      $('#content').html(
         'Empty! [' + arrMSGID.join(', ') + '] not found!'
      );
      return;
   }
   headers.forEach(function(header){
      phiQ.push(function(qNext){
         outputSingleMessage(header, qNext);
      });
   });
   phiQ.start();
});

};
