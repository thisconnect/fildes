var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;

// depends on files of test/test-write.js


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
        t.error(error);
        t.end();
    });
});


tape('read partly', function(t){
    var path = resolve(__dirname, './data/foo.txt');

    var buffer = new Buffer(3);
    file.read(path, buffer, {
        'flags': 'r',
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
        t.error(error);
        t.end();
    });
});


tape('read path error', function(t){
    var path = resolve(__dirname, './data/foo.txt');

    file.read(path)
    .then(function(data){
        t.fail('should have no data');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.ok(error instanceof TypeError, 'is TypeError');
        t.end();
    });
});


tape('read fd error', function(t){
    file.read(-1, new Buffer(3), {
        'offset': 0,
        'length': 3
    })
    .then(function(data){
        t.fail('should have no data');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.syscall, 'read', 'error.syscall is read');
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.end();
    });
});
