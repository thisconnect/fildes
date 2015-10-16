var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


tape('mkdir', function(t){
    var path = resolve(__dirname, './data/a/new/dir');

    file.mkdir(path)
    .then(function(data){
        t.pass('dir created');
        t.end();
    })
    .catch(function(error){
        t.error(error, error.message);
        t.end();
    });
});

tape('rmdir', function(t){
    var path = resolve(__dirname, './data/a/new/dir');

    file.rmdir(path)
    .then(function(data){
        t.pass('dir deleted');
        t.end();
    })
    .catch(function(error){
        t.error(error, error.message);
        t.end();
    });
});
