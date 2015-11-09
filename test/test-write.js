var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;

var filepath1 = resolve(__dirname, './data/write.json');
var filepath2 = resolve(__dirname, './data/write.txt');
var filepath3 = resolve(__dirname, './data/write2.txt');
var filepath4 = resolve(__dirname, './data/dir/write/write3.txt');


tape('write JSON', function(t){
    file.write(filepath1, {'data': 1})
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(filepath1, 'utf8'), '{"data":1}');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write buffer', function(t){
    file.write(filepath2, new Buffer('Hi!'), {
        'offset': 0,
        'length': 3
    })
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(filepath2, 'utf8'), 'Hi!');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write string at position', function(t){
    file.write(filepath3, 'foo bar baz')
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(filepath3, 'utf8'), 'foo bar baz');

        return file.write(filepath3, 'bOz', {
            // 'flags': 'r+'
            'position': 8
        })
        .then(function(){
            t.pass('file written');
            t.equal(readFileSync(filepath3, 'utf8'), 'foo bar bOz');
            t.end();
        });
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write buffer at position', function(t){
    file.write(filepath3, 'foo bar baz')
    .then(function(){
        return file.write(filepath3, new Buffer('bOz'), {
            'flags': 'r+', // fails with 'w' or 'w+'
            'offset': 0,
            'length': 3,
            'position': 8
        })
        .then(function(){
            t.pass('file written');
            t.equal(readFileSync(filepath3, 'utf8'), 'foo bar bOz');
            t.end();
        });
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write file in a new directory', function(t){
    file.write(filepath4, 'test\n')
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(filepath4, 'utf8'), 'test\n');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write twice with manually opened fd', function(t){
    file.open(filepath2)
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
        t.equal(readFileSync(filepath2, 'utf8'), 'Hi again!');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('write with invalid offset', function(t){
    file.write(filepath2, new Buffer(0), {
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
