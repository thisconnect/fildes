var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;

tape('setup', function(t){
    var path = resolve(__dirname, './data');

    file.mkdir(path)
    .then(function(){
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});

require('./test-open.js');
require('./test-write.js');
require('./test-read.js');
require('./test-stats.js');
require('./test-unlink.js');
require('./test-dir.js');

tape('end', function(t){
    var path = resolve(__dirname, './data');

    file.rmdir(path)
    .then(function(){
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});
