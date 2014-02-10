/* global queue:true */

/*
This script uses `setTimeout(someFunc, 1)` because Node's `setImmediate`
causes too many context switches between Node.js and WebKit and the overall
performance is much worse.
*/

queue = function(){
   if (!(this instanceof queue)) return new queue();

   this.stop();
};

queue.prototype.stop = function(){
   this.tasks = [];
   this.running = false;
};

queue.prototype.push = function(task){
   this.tasks.push(task);
};

queue.prototype.unshift = function(task){
   this.tasks.unshift(task);
};

queue.prototype.shift = function(){
   return this.tasks.shift();
};

queue.prototype.next = function(){
   var here = this;
   setTimeout(function(){
      here.step();
   }, 1);
};

queue.prototype.step = function(){
   if( !this.running ) return;
   var nextTask = this.shift();
   if( typeof nextTask === 'undefined' ){
      this.stop();
      return;
   }
   var qThis = this;
   nextTask(function(){
      qThis.next();
   });
};

queue.prototype.start = function(){
   if( this.running ) return;
   this.running = true;
   this.step();
};