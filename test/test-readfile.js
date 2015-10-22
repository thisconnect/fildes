var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;

// depends on files of test/test-write.js


tape('readFile', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.readFile(path)
    .then(function(data){
        t.ok(Buffer.isBuffer(data), 'is Buffer');
        t.pass('file read');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('readFile utf8', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.readFile(path, { encoding: 'utf8' })
    .then(function(data){
        t.ok(typeof data == 'string', 'is String');
        t.pass('file read');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('readFile non-existing file', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.readFile(path)
    .then(function(data){
        t.fail(data, 'should have no data');
        t.end();
    })
    .catch(function(error){
        t.equal(error.syscall, 'open', 'error.syscall is open');
        t.equal(error.path, path);
        t.ok(error, 'has Error');
        t.end();
    });
});
