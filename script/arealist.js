/* global nw, $, _, arealist:true */
/* global beforeSpace, JAM, phiQ, setup, phiTitle */

var async = nw.require('async');

var hideSeparatorsOfInvisible = () => {
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

var msgNumNewActionQueue = () => {
   $('#areaList .msgnum').each(function(){
      var $msgnum = $(this);
      var $tr = $msgnum.closest('tr');
      var $msgnew = $tr.find('.msgnew');
      phiQ.push(qNext => {
         var echopath = $tr.data('echopath');
         if( echopath.toLowerCase() === 'passthrough' ){
            $msgnum.html('PASS-');
            $msgnew.html('THROUGH');
            return qNext();
         }
         var echobase = JAM( echopath );
         async.series([
            callback => echobase.readJDX(err => {
               if( err ){
                  $msgnum.html('FAIL');
                  return callback();
               }
               $msgnum.html( echobase.size() );
               return callback();
            }),
            callback => echobase.indexLastRead(setup.UserName, (err, idx) => {
               if( err ){
                  $msgnew.html('FAIL');
                  return callback();
               }
               $msgnew.html(echobase.size() - 1 - idx);
               return callback();
            })
         ], () => qNext() );
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
         $this.find('td.echotag').html( _.escape(echotag) );
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
         $this.find('td.echotag').html( _.escape(echotag) );
         $this.hide();
         return true; // continue loop
      }
      var before = echotag.slice(0, foundIndex);
      var center = echotag.slice(foundIndex, foundIndex + toFind.length);
      var after  = echotag.slice(foundIndex + toFind.length);
      $this.find('td.echotag').html(
         _.escape(before) +
         '<b>' + _.escape(center) + '</b>' +
         _.escape(after)
      );
      $this.show();
   });
   hideSeparatorsOfInvisible();
};

arealist = () => { /* jshint indent:false */

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
   // stable sort:
   echoNames = _(echoNames).sortBy( value => value.toLowerCase() );
   var currAreaSep = 0;
   var $currTBody = $('<tbody></tbody>').appendTo('#areaList');
   _(echoNames).each(echoName => {
      while(
         currAreaSep < setup.areaSeparators.length &&
         setup.areaSeparators[currAreaSep].sepName.toLowerCase() <
         echoName.toLowerCase()
      ){
         $currTBody = $('<tbody></tbody>').appendTo('#areaList');
         $('<tr><td colspan=4 class="sepDesc">' +
            _.escape(setup.areaSeparators[currAreaSep].sepDesc) +
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
         '<td>'+_.escape(echoDesc)+'</td>' +
         '<td class="msgnum"><i class="fa fa-spinner fa-spin"></i></td>' +
         '<td class="msgnew"><i class="fa fa-spinner fa-spin"></i></td>' +
         '<td class="echotag">'+_.escape(echoName)+'</td>' +
      '</tr>').data({
         'echotag':  echoName,
         'URL':  'area://' + encodeURIComponent(echoName),
         'echopath': beforeSpace(
            setup.areas.group('EchoArea').first(echoName)
         )
      }).addClass('hasURL').appendTo($currTBody);
   });
   $('<tbody class="noAreaRows" style="display: none;"><tr>' +
      '<td colspan=4 style="text-align: center;">' +
         'Echomail not found.' +
      '</td>' +
   '</tr></tbody>').appendTo('#areaList');
   hideSeparatorsOfInvisible();

   msgNumNewActionQueue();
   phiQ.start();
   $('#searchAreatag').on('keyup', searchAreatagHandler);
}

};