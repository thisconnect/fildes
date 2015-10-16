var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;

tape('open', function(t){
    var path = resolve(__dirname, './data/not/here.txt');

    file.open(path)
    .then(function(fd){
        t.error(fd, 'should not return fd');
        t.end();
    })
    .catch(function(error){
        t.equal(error.syscall, 'open', 'error.syscall is open');
        t.equal(error.path, path);
        t.ok(error, 'has Error');
        t.end();
    });
});

tape('open wx', function(t){
    var path = resolve(__dirname, './data/open.txt');

    file.open(path, { flags: 'wx'})
    .then(function(fd){
        t.ok(fd, 'has file descriptor');
        t.equal(typeof fd, 'number', 'fd is Number');
        // manually close fd
        require('fs').close(fd);
        t.end();
    })
    .catch(function(error){
        t.error(error, error.message);
        t.end();
    });
});
