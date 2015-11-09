var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;

var filepath1 = resolve(__dirname, './data/dir/open/open.txt');
var filepath2 = resolve(__dirname, './data/open.txt');

tape('open w file and dir created', function(t){
    file.open(filepath1, {
        'flags': 'w' // writing, file is created if it does not exist
    })
    .then(function(fd){
        t.ok(fd, 'has file descriptor');
        t.equal(typeof fd, 'number', 'fd is Number');
        return file.close(fd);
    })
    .then(function(){
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('open wx (fails if path exists)', function(t){
    file.open(filepath2, {
        'flags': 'wx'
    })
    .then(function(fd){
        t.ok(fd, 'has file descriptor');
        t.equal(typeof fd, 'number', 'fd is Number');
        return file.close(fd);
    })
    .then(function(){
        return file.open(filepath2, {
            'flags': 'wx'
        });
    })
    .then(function(){
        t.fail('should fail');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
        t.equal(error.syscall, 'open', 'error.syscall is open');
        t.end();
    });
});


tape('open twice', function(t){
    file.open(filepath2)
    .then(function(fd1){
        return file.open(filepath2)
        .then(function(fd2){
            t.ok(fd1, 'has file descriptor 1');
            t.ok(fd2, 'has file descriptor 2');
            t.equal(typeof fd1, 'number', 'fd1 is Number');
            t.equal(typeof fd2, 'number', 'fd2 is Number');
            return Promise.all([file.close(fd1), file.close(fd2)]);
        })
        .then(function(){
            t.end();
        });
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('open r', function(t){
    var path = resolve(__dirname, './data/not/here.txt');

    file.open(path, {
        'flags': 'r' // reading, fails if path exists
    })
    .then(function(fd){
        t.fail('should not return fd');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
        t.equal(error.syscall, 'open', 'error.syscall is open');
        t.equal(error.path, path);
        t.end();
    });
});


tape('open wx+ error', function(t){
    var path = resolve(__dirname, './data/not/here.txt');

    file.open(path, {
        'flags': 'wx+' // reading and writing, fails if path exists
    })
    .then(function(fd){
        t.fail('should not return fd');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
        t.equal(error.syscall, 'open', 'error.syscall is open');
        t.equal(error.path, path);
        t.end();
    });
});


tape('close', function(t){
    file.close(-1)
    .then(function(fd){
        t.fail('should not close nothing');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'close', 'error.syscall is close');
        t.end();
    });
});


tape('close twice', function(t){
    file.open(filepath2)
    .then(function(fd){

        return file.close(fd)
        .then(function(){
            t.pass('close first time');
            return file.close(fd);
        });
    })
    .then(function(){
        t.fail('should not close twice');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'close', 'error.syscall is close');
        t.end();
    });
});
