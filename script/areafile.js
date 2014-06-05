/* global areaFile:true */
/* global _, phiBar */

areaFile = function(URL, parsedURL){ /* jshint indent:false */

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

phiBar.reportErrorHTML([
   'Sorry, opening files embedded in echomail ',
   'is not (yet) supported in PhiDo.',
   '<p>The address <b>',
   _.escapeHTML(URL),
   '</b> could not be opened.',
   '</p>'
].join(''));

};
