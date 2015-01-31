/* global areaFile:true */
/* global $, _, phiBar, phiTitle, phiQ, setup, beforeSpace, JAM, MIME, UUE */

var fileScanNextMessage = function(filename, echobase, msgNum, callback){
   if( msgNum < 1 ){
      phiBar.reportErrorHTML([
         'Sorry, the file <b>',
         _.escapeHTML(filename),
         '</b> could not be found in the area.'
      ].join(''));
      callback();
      return;
   }
   echobase.readHeader(msgNum, function(err, header){
      if( err ){
         phiBar.reportErrorHTML( _.escapeHTML('' + err) );
         callback();
         return;
      }
      phiQ.push(function(qNext){
         echobase.decodeMessage(header, function(err, messageText){
            if( err ){
               phiBar.reportErrorHTML( _.escapeHTML('' + err) );
               qNext();
               return;
            }
            phiQ.push(function(nextMessageProcessed){
               var decodedFile = UUE.decodeFile(messageText, filename);
               if( decodedFile === null ){
                  phiQ.push(function(qNext){
                     fileScanNextMessage(filename, echobase, msgNum-1, qNext);
                  });
                  nextMessageProcessed();
                  return;
               }
               var mimeType = MIME.lookup(filename);
               if([
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'image/svg+xml'
               ].indexOf(mimeType) >= 0 ){
                  var dataURL = 'data:' + mimeType + ';base64,' +
                     decodedFile.toString('base64');
                  if( mimeType === 'image/svg+xml' ){
                     $('#content').html([
                        '<img src="',
                        dataURL,
                        '" style="width: 100%;">'
                     ].join('')).find('img').each(function(){
                        $(this).data('buffer', decodedFile);
                     });
                  } else {
                     $('#content').html([
                        '<img src="',
                        dataURL,
                        '" style="max-width: 100%;">'
                     ].join(''));
                  }
               } else {
                  $('#content').html(
                     "File is found and decoded!!" +
                     "<p>Sorry, you can't (yet) save it.</p>"
                  );
               }
               nextMessageProcessed();
            });
            qNext();
         });
      });
      callback();
   });
};

areaFile = function(URL, parsedURL){ /* jshint indent:false */

var echobase, filename;

// at least `parsedURL.objectPath.length` is positive (see `url-area.js`);
// check if there are several parts:
if( parsedURL.objectPathParts.length > 1 ){
   phiBar.reportErrorHTML([
      'Sorry, PhiDo cannot (yet) traverse complex paths to files.',
      '<p>The address <b>',
      _.escapeHTML(URL),
      '</b> could not be opened.',
      '</p>'
   ].join(''));
   return;
}

filename = parsedURL.objectPathParts[0];

// at least one of `parsedURL.echoNames` is present (see `url-area.js`);
// check if they're multiple:
if( parsedURL.echoNames.length > 1 ){
   phiBar.reportErrorHTML([
      'Sorry, opening files from multiple echomail areas at once ',
      'is not (yet) supported in PhiDo.',
      '<p>The address <b>',
      _.escapeHTML(URL),
      '</b> could not be opened.',
      '</p>'
   ].join(''));
   return;
}

var echotag = parsedURL.echoNames[0][0];
var lcEchotag = echotag.toLowerCase();
var echoNames = setup.areas.group('EchoArea').names();
var foundNames = echoNames.filter(function(echoName){
   return echoName.toLowerCase() === lcEchotag;
});

if( foundNames.length === 0 ){
   phiBar.reportErrorHTML([
      'Sorry, the echomail area <b>',
      echotag,
      '</b> is not found on the system.'
   ].join(''));
   return;
}

var setupEchotag = foundNames[0];
var echoPath = beforeSpace(
   setup.areas.group('EchoArea').first(setupEchotag)
);
if( echoPath.toLowerCase() === 'passthrough' ){
   return phiBar.reportErrorHTML([
      'Sorry, the echomail area <b>',
      echotag,
      '</b> is passthrough.'
   ].join(''));
}
echobase = JAM( echoPath );

var arrDesc = /-d "([^"]+?)"/.exec(
   setup.areas.group('EchoArea').first(setupEchotag)
);
var echoDesc;
if( arrDesc === null ){
   echoDesc = setupEchotag;
   phiTitle(filename + ' in ' + echotag);
} else {
   echoDesc = arrDesc[1];
   phiTitle(filename + ' in ' + echotag + ' [' + echoDesc + ']');
}
phiBar.loadingMsg("Looking for the designated file…");

echobase.readJDX(function(err){
   if( err ) return phiBar.reportErrorHTML( _.escapeHTML('' + err) );

   phiQ.push(function(qNext){
      fileScanNextMessage(filename, echobase, echobase.size(), qNext);
   }).start();
});

};
