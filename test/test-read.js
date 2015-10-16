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
        t.fail(error);
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
        t.fail(error);
    });
});

tape('readFile non-existing file', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.readFile(path)
    .then(function(data){
        t.fail(data);
    })
    .catch(function(error){
        t.equal(error.path, path);
        t.ok(error, 'has Error');
        t.end();
    });
});

tape('read', function(t){
    var path = resolve(__dirname, './data/hi.txt');

    var buffer = new Buffer(3);
    file.read(path, buffer, {
        'offset': 0,
        'length': 3
    })
    .then(function(){
        t.equal(buffer.toString(), 'Hi!');
        t.pass('file read');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('read partly', function(t){
    var path = resolve(__dirname, './data/foo.txt');

    var buffer = new Buffer(3);
    file.read(path, buffer, {
        'offset': 0,
        'length': 3,
        'position': 8
    })
    .then(function(){
        t.equal(buffer.toString(), 'bOz');
        t.pass('file partly read');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});
