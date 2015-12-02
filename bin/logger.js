var colors = require('colors');
var _ = require('lodash');

module.exports = function(options) {

  var logger = {};

  var defaults = {
    tmpl: '[UF]'.grey,
    types: {
      error: { tag: '[e]'.red, tmpl: true },
      info: { tag: '[i]'.cyan, tmpl: true },
      warn: { tag: '[w]'.yellow, tmpl: true },
      check: { tag: '\u2713'.green, tmpl: false, color: 'grey' },
      log: { color: 'grey' }
    }
  };

  var o = _.merge(defaults, options);

  for (var method in o.types) {
    var type = o.types[method];
    var params = {
      tag: type.tag ? type.tag + ' ': '',
      color: type.color || 'white',
      tmpl: type.tmpl ? o.tmpl : ''
    };

    logger[method] = doLog.bind(params);

  }

  function doLog(message, params) {
    var logMessage = [this.tmpl, this.tag, message[this.color]].join('');
    console.log(logMessage);
  }

  return logger;

};
