/* global $, _, arealist:true, beforeSpace, JAM, phiQ, setup */

hideSeparatorsOfInvisible = function(){
   $('#areaList tbody').each(function(){
      var $this = $(this);
      if( $this.find('tr.areaRow:visible').length < 1 ){
         $this.find('td.sepDesc').closest('tr').hide();
      } else {
         $this.find('td.sepDesc').closest('tr').show();
      }
   });
}

arealist = function(){ /* jshint indent:false */

$('#content').html([
'<div style="text-align: center; margin: 0 0 0.5em; padding: 0;">',
   'Welcome, <i class="fa fa-user"></i><b>',
      setup.UserName,
   '!</b>',
'</div><div class="row"><div class="col-xs-12">',
   '<div style="display: flex; flex-direction: row; margin-bottom: 1em;">',
      '<label style="flex-grow: 0; padding: 0 1em 0 0;">Search by areatag:</label>',
      '<input type="text" id="searchAreatag" style="flex-grow: 1;">',
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
         '<td>'+_.escapeHTML(echoName)+'</td>' +
      '</tr>').appendTo($currTBody).data({
         'echotag': echoName,
         'echopath': beforeSpace(
            setup.areas.group('EchoArea').first(echoName)
         )
      });
   });
   hideSeparatorsOfInvisible();
   $('#areaList .msgnum').each(function(){
      var $cell = $(this);
      phiQ.push(function(){
         var echobase = JAM( $cell.closest('tr').data('echopath') );
         echobase.readJDX(function(err){
            if( err ){
               $cell.html('FAIL');
               phiQ.singleNext();
               return;
            }
            $cell.html( echobase.size() );
            phiQ.singleNext();
         });
      });
   });
   $('#areaList .msgnew').each(function(){
      var $cell = $(this);
      phiQ.push(function(){
         var echobase = JAM( $cell.closest('tr').data('echopath') );
         echobase.readJLR(function(err){
            if( err ){
               $cell.html('FAIL');
               phiQ.singleNext();
               return;
            }
            if( echobase.lastreads.length !== 1 ){
               $cell.html('MUD');
               phiQ.singleNext();
               return;
            }
            echobase.readJDX(function(err){
               if( err ){
                  $cell.html('FAIL');
                  phiQ.singleNext();
                  return;
               }
               echobase.readFixedHeaderInfoStruct(function(err, data){
                  if( err ){
                     $cell.html('FAIL');
                     phiQ.singleNext();
                     return;
                  }
                  var nextIDX = echobase.size() - 1;
                  while( nextIDX > 0 ){
                     if(
                        echobase.indexStructure[nextIDX].MessageNum0 +
                        data.basemsgnum ===
                        echobase.lastreads[0].LastRead
                     ){
                        $cell.html(echobase.size() - 1 - nextIDX);
                        phiQ.singleNext();
                        return;
                     } else nextIDX--;
                  }
                  $cell.html('FAIL');
                  phiQ.singleNext();
                  return;
               });
            });
         });
      });
   });
   phiQ.singleStep();
}

};