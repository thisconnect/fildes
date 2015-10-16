var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


tape('unlink', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.unlink(path)
    .then(function(data){
        t.pass('file deleted');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});

tape('unlink non-existing file', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.unlink(path)
    .then(function(stats){
        t.fail(data);
    })
    .catch(function(error){
        t.equal(error.path, path);
        t.ok(error, 'has Error');
        t.end();
    });
});
