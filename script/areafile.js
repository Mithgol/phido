/* global areaFile:true */
/* global $, _, phiBar, phiTitle, phiQ, setup, beforeSpace, JAM, MIME, UUE */

var fileScanNextMessage = (filename, echobase, msgNum, callback) => {
   if( msgNum < 1 ){
      phiBar.reportErrorHTML([
         `Sorry, the file <b>${ _.escape(filename) }</b> `,
         'could not be found in the area.'
      ].join(''));
      return callback();
   }
   echobase.readHeader(msgNum, (err, header) => {
      if( err ){
         phiBar.reportErrorHTML( _.escape('' + err) );
         return callback();
      }
      phiQ.push(qNext =>
         echobase.decodeMessage(header, (err, messageText) => {
            if( err ){
               phiBar.reportErrorHTML( _.escape('' + err) );
               return qNext();
            }
            phiQ.push(nextMessageProcessed => {
               var decodedFile = UUE.decodeFile(messageText, filename);
               if( decodedFile === null ){
                  phiQ.push(qNext =>
                     fileScanNextMessage(filename, echobase, msgNum-1, qNext)
                  );
                  return nextMessageProcessed();
               }
               var mimeType = MIME.lookup(filename);
               if([
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'image/svg+xml'
               ].indexOf(mimeType) >= 0 ){
                  var dataURL = `data:${mimeType};base64,` +
                     decodedFile.toString('base64');
                  if( mimeType === 'image/svg+xml' ){
                     $('#content').html(
                        `<img src="${dataURL}" style="width: 100%;">`
                     ).find('img').each(function(){
                        $(this).data('buffer', decodedFile);
                     });
                  } else $('#content').html(
                     `<img src="${dataURL}" style="max-width: 100%;">`
                  );
               } else $('#content').html(
                     "File is found and decoded!!" +
                     "<p>Sorry, you can't (yet) save it.</p>"
               );
               return nextMessageProcessed();
            });
            return qNext();
         })
      );
      return callback();
   });
};

areaFile = (URL, parsedURL) => { /* jshint indent:false */

var echobase, filename;

// at least `parsedURL.objectPath.length` is positive (see `url-area.js`);
// check if there are several parts:
if( parsedURL.objectPathParts.length > 1 ) return phiBar.reportErrorHTML(
   'Sorry, PhiDo cannot (yet) traverse complex paths to files.' +
   `<p>The address <b>${ _.escape(URL) }</b> could not be opened.</p>`
);

filename = parsedURL.objectPathParts[0];

// at least one of `parsedURL.echoNames` is present (see `url-area.js`);
// check if they're multiple:
if( parsedURL.echoNames.length > 1 ) return phiBar.reportErrorHTML([
   'Sorry, opening files from multiple echomail areas at once ',
   'is not (yet) supported in PhiDo.',
   `<p>The address <b>${ _.escape(URL) }</b> could not be opened.</p>`
].join(''));

var echotag = parsedURL.echoNames[0][0];
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
var echoDesc;
if( arrDesc === null ){
   echoDesc = setupEchotag;
   phiTitle(filename + ' in ' + echotag);
} else {
   echoDesc = arrDesc[1];
   phiTitle(filename + ' in ' + echotag + ' [' + echoDesc + ']');
}
phiBar.loadingMsg('Looking for the designated file…');

echobase.readJDX(err => {
   if( err ) return phiBar.reportErrorHTML( _.escape('' + err) );

   phiQ.push(
      qNext => fileScanNextMessage(filename, echobase, echobase.size(), qNext)
   ).start();
});

};
