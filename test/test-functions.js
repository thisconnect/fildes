var file = require('../');

var test = require('tape');

// https://top.fse.guru/nodejs-a-quick-optimization-advice-7353b820c92e#.ytqibx71s

test('function length below 600', function(t) {
  var length;
  for (var method in file) {
    length = file[method].toString().length;
    t.ok(length < 600, method + ' has ' + length + ' chars');
  }
  t.end();
});
