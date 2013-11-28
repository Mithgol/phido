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

queue.prototype.pop = function(){
   return this.tasks.pop();
};

queue.prototype.step = function(){
   if( !this.running ) return;
   var nextTask = this.pop();
   if( typeof nextTask === 'undefined' ){
      this.stop();
      return;
   }
   nextTask();
   var here = this;
   setTimeout(function(){
      here.step();
   }, 1);
};

queue.prototype.start = function(){
   if( this.running ) return;
   this.running = true;
   this.step();
};