/* global renderAreaURL:true, _, arealist, msglist, singleMessage, phiBar */

renderAreaURL = function(URL, parsedURL){
   if ( parsedURL.objectPath.length > 0 ){
      phiBar.reportErrorHTML([
         'Sorry, opening files embedded in echomail ',
         'is not (yet) supported in PhiDo.',
         '<p>The address <b>',
         _.escapeHTML(URL),
         '</b> could not be opened.',
         '</p>'
      ].join(''));
      return;
   }
   if( parsedURL.echoNames.length > 1 ){
      phiBar.reportErrorHTML([
         'Sorry, opening multiple echomail areas at once ',
         'is not (yet) supported in PhiDo.',
         '<p>The address <b>',
         _.escapeHTML(URL),
         '</b> could not be opened.',
         '</p>'
      ].join(''));
      return;
   }
   if( parsedURL.echoNames.length < 1 ){
      arealist();
      return;
   }
   // parsedURL.echoNames.length === 1
   var foundMSGID = false;
   for( var i = 0; i < parsedURL.optionalParams.length; i++ ){
      if( parsedURL.optionalParams[i].name === 'msgid' ){
         foundMSGID = true;
         break;
      }
   }
   if( foundMSGID ){
      singleMessage(parsedURL.echoNames[0][0], parsedURL);
      return;
   }
   msglist( parsedURL.echoNames[0][0] );
};