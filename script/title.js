/* global phiTitle:true, document */

phiTitle = function(givenTitle){
   givenTitle = '' + givenTitle;
   if( givenTitle === '' ){
      document.title = 'PhiDo';
      return;
   }
   document.title = givenTitle + ' - PhiDo';
};