var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var file1 = resolve(__dirname, './data/read.txt');
var file2 = resolve(__dirname, './data/read-foo-bar.txt');


tape('setup', function(t){
    writeFileSync(file1, 'Hi!!!\n');
    writeFileSync(file2, 'foo bar bOz\n');
    t.end();
});


tape('read', function(t){
    file.read(file1, {
        'length': 4
    })
    .then(function(buffer){
        t.pass('file read');
        t.deepEqual(buffer, new Buffer('Hi!!'));
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});



tape('read to buffer', function(t){
    var buffer = new Buffer(3);
    file.read(file1, buffer, {
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

    var buffer = new Buffer(3);
    file.read(file2, buffer, {
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
    file.read(file2)
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
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'read', 'error.syscall is read');
        t.end();
    });
});
