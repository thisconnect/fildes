var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


tape('fstat', function(t){
    var path = resolve(__dirname, './data/hi.txt');

    file.fstat(path)
    .then(function(stats){
        t.equal(stats.size, 3, 'stats.size is 3');
        t.pass('stats received');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('fstat non-existing file', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.fstat(path)
    .then(function(stats){
        t.fail(stats, 'should have no stats');
        t.end();
    })
    .catch(function(error){
        t.ok(error, 'has Error');
        t.equal(error.syscall, 'open', 'error.syscall is open');
        t.equal(error.path, path);
        t.end();
    });
});


tape('fstat wrong fd', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.fstat(-1)
    .then(function(stats){
        t.fail(stats, 'should have no stats');
        t.end();
    })
    .catch(function(error){
        t.ok(error, 'has Error');
        t.equal(error.syscall, 'fstat', 'error.syscall is fstat');
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.end();
    });
});
