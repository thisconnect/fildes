var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;


tape('write JSON', function(t){
    var path = resolve(__dirname, './data/data.json');

    file.write(path, {'data': 1})
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(path, 'utf8'), '{"data":1}');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write buffer', function(t){
    var path = resolve(__dirname, './data/hi.txt');

    file.write(path, new Buffer('Hi!'), {
        'offset': 0,
        'length': 3
    })
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(path, 'utf8'), 'Hi!');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write string at position', function(t){
    var path = resolve(__dirname, './data/foo2.txt');

    file.write(path, 'foo bar baz', {
        flags: 'w'
    })
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(path, 'utf8'), 'foo bar baz');

        return file.write(path, 'bOz', {
            'position': 8
        })
        .then(function(){
            t.pass('file written');
            t.equal(readFileSync(path, 'utf8'), 'foo bar bOz');
            t.end();
        });
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write buffer at position', function(t){
    var path = resolve(__dirname, './data/foo.txt');

    file.write(path, 'foo bar baz', {
        flags: 'w'
    })
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(path, 'utf8'), 'foo bar baz');

        return file.write(path, new Buffer('bOz'), {
            'offset': 0,
            'length': 3,
            'position': 8
        })
        .then(function(){
            t.pass('file written');
            t.equal(readFileSync(path, 'utf8'), 'foo bar bOz');
            t.end();
        });
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('open fd then write twice and close', function(t){
    var path = resolve(__dirname, './data/manual.txt');

    file.open(path)
    .then(function(fd){
        return file.write(fd, 'Hi there!')
        .then(function(){
            return file.write(fd, new Buffer('again'), {
                'offset': 0,
                'length': 5,
                'position': 3
            });
        })
        .then(function(){
            return file.close(fd);
        });
    })
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(path, 'utf8'), 'Hi again!');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write with invalid offset', function(t){
    var path = resolve(__dirname, './data/err.txt');

    file.write(path, new Buffer(0), {
        'offset': -1
    })
    .then(function(){
        t.fail('file written');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.ok(error instanceof RangeError, 'is RangeError');
        t.end();
    });
});


tape('write buffer fd error', function(t){
    file.write(-1, new Buffer(0))
    .then(function(data){
        t.fail('should have no data');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'write', 'error.syscall is write');
        t.end();
    });
});


tape('write fd error', function(t){
    file.write(-1)
    .then(function(data){
        t.fail('should have no data');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'write', 'error.syscall is write');
        t.end();
    });
});
