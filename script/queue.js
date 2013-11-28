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
   nextTask();
   this.next();
};

queue.prototype.singleNext = function(){
   var here = this;
   setTimeout(function(){
      here.singleStep();
   }, 1);
};

queue.prototype.singleStep = function(){
   if( this.running ) return;
   var nextTask = this.shift();
   if( typeof nextTask === 'undefined' ) return;
   nextTask();
};

queue.prototype.start = function(){
   if( this.running ) return;
   this.running = true;
   this.step();
};