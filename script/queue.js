/* global window, queue:true */

/*
This script used `setTimeout(someFunc, 1)` because Node's `setImmediate`
causes too many context switches between Node.js and WebKit and the overall
performance is much worse.

Then it started using http://dbaron.org/log/20100309-faster-timeouts because
it provided faster timeouts.
*/
(function(window){
   var timeouts = [];
   var messageName = 'zero-timeout-message';

   // Like setTimeout, but only takes a function argument.  There's
   // no time argument (always zero) and no arguments (you have to
   // use a closure).
   function setZeroTimeout(fn){
      timeouts.push(fn);
      window.postMessage(messageName, '*');
   }

   function handleMessage(event) {
      if (event.source === window && event.data === messageName) {
         event.stopPropagation();
         if( timeouts.length > 0 ){
            var fn = timeouts.shift();
            fn();
         }
      }
   }

   window.addEventListener('message', handleMessage, true);

   window.setZeroTimeout = setZeroTimeout;
})(window);

queue = function(){
   if (!(this instanceof queue)) return new queue();

   this.stop();
};

queue.prototype.stop = function(){
   this.tasks = [];
   this.running = false;
   return this;
};

queue.prototype.push = function(task){
   this.tasks.push(task);
   return this;
};

queue.prototype.unshift = function(task){
   this.tasks.unshift(task);
   return this;
};

queue.prototype.shift = function(){
   return this.tasks.shift();
};

queue.prototype.next = function(){
   var here = this;
   window.setZeroTimeout(function(){
      here.step();
   });
   return this;
};

queue.prototype.step = function(){
   if( !this.running ) return this;
   var nextTask = this.shift();
   if( typeof nextTask === 'undefined' ){
      this.stop();
      return this;
   }
   var here = this;
   nextTask(function(){
      here.next();
   });
   return this;
};

queue.prototype.start = function(){
   if( this.running ) return this;
   this.running = true;
   this.step();
   return this;
};