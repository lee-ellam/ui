(function(global) {
  'use strict';

  global.jg = global.jg || {};
  global.jg.chrome = global.jg.chrome || {};

  global.jg.chrome.addNumbers = function() {
    if (!arguments.length) return 0;

    var args = [].slice.apply(arguments);

    return args.reduce(function(prev, num) {
      if (typeof num !== 'number') return prev;
      return prev + num;
    }, 0);
  };
})(this);