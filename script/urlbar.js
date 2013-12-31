/* global $, _, phiURL, arealist, urlbar:true */

urlbar = function(){
   if (!(this instanceof urlbar)) return new urlbar();

   this.history = [];
   this.curr = -1;
};

urlbar.prototype.attach = function($element){
   var $urlbar = $element;
   var _urlbar = this;

   this.$URL     = $urlbar.find('#URL');
   this.$goToURL = $urlbar.find('#goToURL');
   this.$back    = $urlbar.find('#back');
   this.$forward = $urlbar.find('#forward');

   this.$back.on('click', function(){
      _urlbar.back();
      this.blur();
   });
   this.$forward.on('click', function(){
      _urlbar.forward();
      this.blur();
   });
   this.$URL.on('keyup', null, 'return', function(){
      _urlbar.open( this.value );
   });
   this.$goToURL.on('click', function(){
      _urlbar.open( _urlbar.$URL.val() );
      this.blur();
   });

};

urlbar.prototype.open = function(URL){
   if(this.curr >= 0 ){
      this.history.length = this.curr + 1;
   }
   this.history.push(URL);
   this.curr++;

   this.$URL.val(URL);
   this.$forward.attr('disabled', 'disabled');
   if( this.curr > 0 ) this.$back.removeAttr('disabled');

   this.render(URL);
};

urlbar.prototype.forward = function(){
   if( this.history.length <= 0 || this.history.length <= this.curr + 1 ){
      return;
   }
   this.curr++;
   var URL = this.history[this.curr];

   this.$URL.val(URL);
   if( this.history.length <= this.curr + 1 ) {
      this.$forward.attr('disabled', 'disabled');
   }
   if( this.curr > 0 ) this.$back.removeAttr('disabled');

   this.render(URL);
};

urlbar.prototype.back = function(){
   if( this.curr <= 0 ) return;
   this.curr--;
   var URL = this.history[this.curr];

   this.$URL.val(URL);
   this.$forward.removeAttr('disabled');
   if( this.curr <= 0 ) this.$back.attr('disabled', 'disabled');

   this.render(URL);
};

urlbar.prototype.render = function(URL){
   var parsedURL;
   try {
      parsedURL = phiURL(URL);
   } catch(e) {
      return this.reportErrorHTML(
         _.escapeHTML(e.message)
      );
   }
   if( parsedURL.scheme !== 'area' ){
      return this.reportErrorHTML([
         'Sorry, the FGHI URL scheme <b>',
         parsedURL.scheme,
         '</b> is not supported.'
      ].join(''));
   }
   arealist(); // TODO: really use parsedURLs to determine rendering
};

urlbar.prototype.reportErrorHTML = function(errorHTML){
   $('#content').html(['<div style="text-align: center;">',
      '<i class="fa fa-exclamation-triangle fa-5x"></i><br>',
      errorHTML,
   '</div>'].join(''));
};