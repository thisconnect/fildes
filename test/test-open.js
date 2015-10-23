var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


tape('open w file and dir created', function(t){
    var path = resolve(__dirname, './data/dir/sub/file.txt');

    file.open(path, {
        'flags': 'w' // writing, file is created if it does not exist
    })
    .then(function(fd){
        t.ok(fd, 'has file descriptor');
        t.equal(typeof fd, 'number', 'fd is Number');
        // manually close fd
        require('fs').close(fd);
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('open wx (fails if path exists)', function(t){
    var path = resolve(__dirname, './data/open.txt');

    file.open(path, {
        'flags': 'wx' // writing, fails if path exists
    })
    .then(function(fd){
        t.ok(fd, 'has file descriptor');
        t.equal(typeof fd, 'number', 'fd is Number');
        // manually close fd
        require('fs').close(fd);
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('open twice', function(t){
    var path = resolve(__dirname, './data/open.txt');

    file.open(path)
    .then(function(fd1){
        return file.open(path)
        .then(function(fd2){
            t.ok(fd1, 'has file descriptor 1');
            t.ok(fd2, 'has file descriptor 2');
            t.equal(typeof fd1, 'number', 'fd1 is Number');
            t.equal(typeof fd2, 'number', 'fd2 is Number');
            // manually close fd
            require('fs').close(fd1);
            require('fs').close(fd2);
            t.end();
        });
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('open', function(t){
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


tape('open error', function(t){
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
    var path = resolve(__dirname, './data/close-twice.txt');

    file.open(path)
    .then(function(fd){

        return file.close(fd)
        .then(function(){
            t.pass('close first time');
            return file.close(fd);
        })
        .then(function(){
            t.fail('should not close twice');
            t.end();
        });
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'close', 'error.syscall is close');
        t.end();
    });
});
