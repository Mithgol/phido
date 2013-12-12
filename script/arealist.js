arealist = function(){

$('#content').html([
'<div style="text-align: center; margin: 0 0 0.5em; padding: 0;">',
   'Welcome, <i class="fa fa-user"></i><b>',
      setup.UserName,
   '!</b>',
'</div>'
].join(''));
var echoNames = setup.areas.group('EchoArea').names();
if( echoNames.length > 0 ){
   $('#content').append('<table id="areaList" class="table table-bordered table-hover table-condensed">' +
   '<tr class="inverse">' +
      '<th>Area title</th>' +
      '<th style="text-align: center;">Msgs</th>' +
      '<th>Echotag</th>' +
   '</tr></table>');
   echoNames = _(echoNames).sortBy(function(value){ // stable sort
      return value.toLowerCase();
   });
   _(echoNames).each(function(echoName){
      var arrDesc = /-d "([^"]+?)"/.exec( setup.areas.group('EchoArea').first(echoName) );
      var echoDesc;
      if( arrDesc === null ){
         echoDesc = echoName;
      } else {
         echoDesc = arrDesc[1];
      }
      $('<tr>' +
         '<td>'+_.escapeHTML(echoDesc)+'</td>' +
         '<td class="msgnum"><i class="fa fa-spinner fa-spin"></i></td>' +
         '<td>'+_.escapeHTML(echoName)+'</td>' +
      '</tr>').appendTo('#areaList tbody').find('.msgnum').data({
         'echopath': beforeSpace( setup.areas.group('EchoArea').first(echoName) )
      });
   });
   $('#areaList .msgnum').each(function(idx){
      var $cell = $(this);
      phiQ.push(function(){
         var echobase = JAM( $cell.data('echopath') );
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
   phiQ.singleStep();
}

}
