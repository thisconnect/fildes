var file = require('../');

var tape = require('tape');
var rimraf = require('rimraf');
var resolve = require('path').resolve;
var debug = require('debug');
debug.log = console.log.bind(console);


tape('setup', function(t){
    var path = resolve(__dirname, './data');

    rimraf(path, function(error){
        if (error){
            t.error(error);
            t.end();
        }
        file.mkdir(path)
        .then(function(){
            t.end();
        })
        .catch(function(error){
            t.error(error);
            t.end();
        });
    });
});


require('./test-open.js');
require('./test-writefile.js');
require('./test-write.js');
require('./test-read.js');
require('./test-readfile.js');
require('./test-access.js');
require('./test-stats.js');
require('./test-append.js');
require('./test-truncate.js');
require('./test-utimes.js');
require('./test-chmod.js');
require('./test-chown.js');
require('./test-sync.js');
require('./test-unlink.js');
require('./test-rename.js');
require('./test-links.js');
require('./test-symlinks.js');
require('./test-dir.js');

// require('./test-functions.js');
