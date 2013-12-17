urlbar = function(){
   if (!(this instanceof urlbar)) return new urlbar();

   this.history = [];
   this.curr = -1;
};

urlbar.prototype.open = function(URL){
   if(this.curr >= 0 ){
      this.history.length = this.curr + 1;
   }
   this.history.push(URL);
   this.curr++;

   $urlbar = $('#urlbar');
   $urlbar.find('#URL').val( URL );
   $urlbar.find('#forward').attr('disabled', 'disabled');
   if( this.curr > 0 ) $urlbar.find('#back').attr('disabled', '');

   this.render(URL);
};

urlbar.prototype.forward = function(){
   if( this.history.length <= 0 || this.history.length <= this.curr + 1 ){
      return;
   }
   this.curr++;
   var URL = this.history[this.curr];

   $urlbar = $('#urlbar');
   $urlbar.find('#URL').val( URL );
   if( this.history.length <= this.curr + 1 ) {
      $urlbar.find('#forward').attr('disabled', 'disabled');
   }
   if( this.curr > 0 ) $urlbar.find('#back').attr('disabled', '');

   this.render(URL);
};

urlbar.prototype.render = function(URL){
   try {
      var parsedURL = phiURL(URL);
   } catch(e) {
      $('#content').html([
      '<div style="text-align: center;">',
         '<i class="fa fa-exclamation-triangle fa-5x"></i><br>',
         ''+e,
      '</div>'
      ].join(''));
      return;
   }
};