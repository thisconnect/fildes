var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var debug = require('debug');
debug.log = console.log.bind(console);

tape('setup', function(t){
    var path = resolve(__dirname, './data');

    file.rmdir(path)
    .then(function(){
        return file.mkdir(path);
    })
    .then(t.end)
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
require('./test-append.js');
require('./test-truncate.js');
require('./test-utimes.js');
require('./test-chmod.js');
require('./test-unlink.js');
require('./test-rename.js');
require('./test-dir.js');
// require('./test-functions.js');
