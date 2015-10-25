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


tape('get size of many files', function(t){
    var files = ['buffer.txt', 'data.json', 'file.txt'];

    Promise.all(files.map(function(filename){
        var filepath = resolve(__dirname, 'data', filename);
        return file.fstat(filepath);
    }))
    .then(function(stats){
        return stats.map(function(stat){
            return stat.size;
        });
    })
    .then(function(sizes){
        t.equal(sizes.length, 3, 'stats.length is 3');
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
        t.fail('should have no stats');
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


tape('fstat wrong fd', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.fstat(-1)
    .then(function(stats){
        t.fail('should have no stats');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'fstat', 'error.syscall is fstat');
        t.end();
    });
});
