/* global phiTitle:true, document */

phiTitle = givenTitle => {
   givenTitle = '' + givenTitle;
   if( givenTitle === '' ){
      document.title = 'PhiDo';
      return;
   }
   document.title = givenTitle + ' - PhiDo';
};