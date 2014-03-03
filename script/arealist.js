/* global $, _, arealist:true */
/* global beforeSpace, JAM, phiQ, phiBar, setup, phiTitle, GUI, nwClipboard */

var hideSeparatorsOfInvisible = function(){
   $('#areaList tbody').each(function(){
      var $this = $(this);
      if( $this.find('tr.areaRow:visible').length < 1 ){
         $this.find('td.sepDesc').closest('tr').hide();
      } else {
         $this.find('td.sepDesc').closest('tr').show();
      }
   });

   var $searchGroup = $('#searchAreatag').closest('.form-group');
   if( $('#areaList tr.areaRow:visible').length < 1 ){
      $('#areaList tbody.noAreaRows').show();
      $searchGroup.addClass('has-error').removeClass('has-success');
   } else {
      $('#areaList tbody.noAreaRows').hide();
      $searchGroup.removeClass('has-error').addClass('has-success');
   }
};

var msgnumActionQueue = function(){
   $('#areaList .msgnum').each(function(){
      var $cell = $(this);
      phiQ.push(function(qNext){
         var echobase = JAM( $cell.closest('tr').data('echopath') );
         echobase.readJDX(function(err){
            if( err ){
               $cell.html('FAIL');
               qNext();
               return;
            }
            $cell.html( echobase.size() );
            qNext();
         });
      });
   });
};

var msgnewActionQueue = function(){
   $('#areaList .msgnew').each(function(){
      var $cell = $(this);
      phiQ.push(function(qNext){
         var echobase = JAM( $cell.closest('tr').data('echopath') );
         echobase.indexLastRead(setup.UserName, function(err, idx){
            if( err ){
               $cell.html('FAIL');
               qNext();
               return;
            }
            $cell.html(echobase.size() - 1 - idx);
            qNext();
            return;
         });
      });
   });
};

var searchAreatagHandler = function(){
   var $this = $(this);
   if( $this.val() === $this.data('val') ) return;
   $this.data('val', $this.val());

   var toFind = $this.val().toLowerCase();
   if( toFind === '' ){
      $('#areaList tr.areaRow').each(function(){
         var $this = $(this);
         var echotag = $this.data('echotag');
         $this.find('td.echotag').html( _.escapeHTML(echotag) );
         $this.show();
      });
      hideSeparatorsOfInvisible();
      return;
   }

   $('#areaList tr.areaRow').each(function(){
      var $this = $(this);
      var echotag = $this.data('echotag');
      var foundIndex = echotag.toLowerCase().indexOf(toFind);
      if( foundIndex < 0 ){
         $this.find('td.echotag').html( _.escapeHTML(echotag) );
         $this.hide();
         return true; // continue loop
      }
      var before = echotag.slice(0, foundIndex);
      var center = echotag.slice(foundIndex, foundIndex + toFind.length);
      var after  = echotag.slice(foundIndex + toFind.length);
      $this.find('td.echotag').html(
         _.escapeHTML(before) +
         '<b>' + _.escapeHTML(center) + '</b>' +
         _.escapeHTML(after)
      );
      $this.show();
   });
   hideSeparatorsOfInvisible();
};

arealist = function(){ /* jshint indent:false */

phiTitle('Arealist');

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

   $('#areaList .areaRow').each(function(){
      var $row = $(this);
      $row.on('contextmenu', function(e){
         var contextMenu = new GUI.Menu();
         contextMenu.append(new GUI.MenuItem({
            'label': 'Copy FGHI URL',
            'click': function(){
               nwClipboard.set( $row.data('areaURL') );
            }
         }));
         $row.data('contextMenu', contextMenu);
         $row.data('contextMenu').popup(e.originalEvent.x, e.originalEvent.y);
         return false;
      });
   });

   msgnumActionQueue();
   msgnewActionQueue();
   phiQ.start();
   $('#searchAreatag').on('keyup', searchAreatagHandler);
}

};