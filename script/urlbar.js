urlbar = function(){
   if (!(this instanceof urlbar)) return new urlbar();

   this.history = [];
   this.curr = -1;
};

urlbar.prototype.open = function(URL){
   if(this.curr < this.history.length-1 ){
      this.history.splice(this.curr + 1, this.history.length - 1 - this.curr);
   }
   this.history.push(URL);
   this.curr++;

   $urlbar = $('#urlbar');
   $urlbar.find('#URL').val( URL );
   $urlbar.find('#forward').attr('disabled', 'disabled');
   if( this.curr > 0 ) $urlbar.find('#back').attr('disabled', '');

   try {
      var parsedURL = phiURL(URL);
   } catch(e) {
      $('#content').html([
      '<div style="text-align: center;">',
         '<i class="fa fa-exclamation-triangle fa-5x"></i><br>',
         ''+e,
      '</div>'
      ].join(''));
   }
};