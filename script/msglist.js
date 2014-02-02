/* global $, _, msglist:true, phiTitle, phiBar, setup, JAM, beforeSpace */

msglist = function(echotag){ /* jshint indent:false */

phiTitle(echotag + ' - messages');
var lcEchoTag = echotag.toLowerCase();

var echoNames = setup.areas.group('EchoArea').names();
var foundNames = echoNames.filter(function(echoName){
   return echoName.toLowerCase() === lcEchoTag;
});

if( foundNames.length === 0 ){
   return phiBar.reportErrorHTML([
      'Sorry, the echomail area <b>',
      echotag,
      '</b> is not found on the system.'
   ].join(''));
}

var echoPath = beforeSpace(
   setup.areas.group('EchoArea').first(foundNames[0])
);
var echobase = JAM( echoPath );

echobase.readJDX(function(err){
   if( err ) return phiBar.reportErrorHTML([
      _.escapeHTML('' + err)
   ].join(''));

   $('#content').html([
      'TODO: ',
      echobase.size(),
      ' message(s) from the <b>',
      echotag,
      '</b> echomail area.'
   ].join(''));
   $('#content').append([
      '<table id="msgList" ',
      'class="table table-bordered table-hover table-condensed">',
      '<tbody><tr class="inverse">',
      '<th>Num</th>',
      '<th>Sender</th>',
      '<th>Recipient</th>',
      '<th>Subject</th>',
      '<th>Date / time</th>',
      '</tr></tbody></table>'
   ].join(''));
});


/*
$('#content').html([
'<div style="text-align: center; margin: 0 0 0.5em; padding: 0;">',
   'Welcome, <i class="fa fa-user"></i><b>',
      setup.UserName,
   '!</b>',
'</div><div class="row"><div class="col-xs-12 form-group">',
   '<div style="display: flex; flex-direction: row; margin-bottom: 1em;">',
      '<label style="flex-grow: 0; padding: 0.3em 1em 0 0; ',
      'white-space: nowrap;">',
         'Search by areatag:',
      '</label>',
      '<input type="text" id="searchAreatag" ',
      'class="form-control" style="flex-grow: 1; margin: 0 0 0 2em;">',
   '</div>',
'</div></div>'
].join(''));
var echoNames = setup.areas.group('EchoArea').names();
if( echoNames.length > 0 ){
   $('#content').append(
   '<table id="areaList" ' +
          'class="table table-bordered table-hover table-condensed">' +
   '<tbody><tr class="inverse">' +
      '<th>Area title</th>' +
      '<th style="text-align: center;">Msgs</th>' +
      '<th style="text-align: center;">New</th>' +
      '<th>Echotag</th>' +
   '</tr></tbody></table>');
   echoNames = _(echoNames).sortBy(function(value){ // stable sort
      return value.toLowerCase();
   });
   var currAreaSep = 0;
   var $currTBody = $('<tbody></tbody>').appendTo('#areaList');
   _(echoNames).each(function(echoName){
      while(
         currAreaSep < setup.areaSeparators.length &&
         setup.areaSeparators[currAreaSep].sepName.toLowerCase() <
         echoName.toLowerCase()
      ){
         $currTBody = $('<tbody></tbody>').appendTo('#areaList');
         $('<tr><td colspan=4 class="sepDesc">' +
            _.escapeHTML(setup.areaSeparators[currAreaSep].sepDesc) +
         '</td></tr>').appendTo($currTBody);
         currAreaSep++;
      }
      var arrDesc = /-d "([^"]+?)"/.exec(
         setup.areas.group('EchoArea').first(echoName)
      );
      var echoDesc;
      if( arrDesc === null ){
         echoDesc = echoName;
      } else {
         echoDesc = arrDesc[1];
      }
      $('<tr class="areaRow">' +
         '<td>'+_.escapeHTML(echoDesc)+'</td>' +
         '<td class="msgnum"><i class="fa fa-spinner fa-spin"></i></td>' +
         '<td class="msgnew"><i class="fa fa-spinner fa-spin"></i></td>' +
         '<td class="echotag">'+_.escapeHTML(echoName)+'</td>' +
      '</tr>').data({
         'echotag':  echoName,
         'areaURL':  'area://' + encodeURIComponent(echoName),
         'echopath': beforeSpace(
            setup.areas.group('EchoArea').first(echoName)
         )
      }).on('click', function(){
         phiBar.open( $(this).data('areaURL') );
      }).appendTo($currTBody);
   });
   $('<tbody class="noAreaRows" style="display: none;"><tr>' +
      '<td colspan=4 style="text-align: center;">' +
         'Echomail not found.' +
      '</td>' +
   '</tr></tbody>').appendTo('#areaList');
   hideSeparatorsOfInvisible();
   contextMenuQueue();
   msgnumActionQueue();
   msgnewActionQueue();
   phiQ.singleStep();
   $('#searchAreatag').on('keyup', searchAreatagHandler);
}
*/

};