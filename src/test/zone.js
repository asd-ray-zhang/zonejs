var log = function(phase){
    return function(){
        console.log("I am in zone.js " + phase + "!");
    };
};

var profilingZoneSpec = (function () {
    var time = 0,
        // use the high-res timer if available
        timer = performance ?
                    performance.now.bind(performance) :
                    Date.now.bind(Date);
    return {
        onScheduleTask: function(parentZoneDelegate, currentZone, targetZone, task){
            console.log('onScheduleTask:  '+targetZone.name  + '   :   '+currentZone.name);
            return parentZoneDelegate.scheduleTask(targetZone, task);
        },
        name: 'ZoneA',
      onInvokeTask: function (delegate, current, target, task, applyThis, applyArgs) {
            try{
                console.log('onInvokeTask');
            this.start = timer();
            delegate.invokeTask(target, task, applyThis, applyArgs);
            time += timer() - this.start;
            }finally{
                console.log('finally.........');
            }
            
      
        },
      time: function () {
          debugger;
        return Math.floor(time*100) / 100 + 'ms';
      },
      reset: function () {
          debuger;
        time = 0;
      }
    };
  }());

console.log(`begin----current zone is ${Zone.current.name}`);
Zone.current.fork(profilingZoneSpec).run(function(){
    console.log(`run------current zone is ${Zone.current.name}`);
    var methodLog = function(func){
        return function(){
            console.log("I am from " + func + " function!");
        };
    },
    foo = methodLog("foo"),
    bar = methodLog("bar"),
    baz = function(){
        setTimeout(methodLog('baz in setTimeout'), 0);
    };

    foo();
    baz();
    bar();
});