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
        t.error(error);
        t.end();
    });
});

require('./test-open.js');
require('./test-writefile.js');
require('./test-write.js');
require('./test-read.js');
require('./test-readfile.js');
require('./test-stats.js');
require('./test-unlink.js');
require('./test-dir.js');
// require('./test-functions.js');

/*
tape('end', function(t){
    var path = resolve(__dirname, './data');

    file.rmdir(path)
    .then(function(){
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});
*/
