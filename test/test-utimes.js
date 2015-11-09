var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var statSync = require('fs').statSync;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/utimes.txt');


tape('setup utimes', function(t){
    writeFileSync(filepath1, 'file content\n');
    t.end();
});


tape('utimes', function(t){
    var now = Date.now();
    var firstoct = new Date('2015-10-01');

    file.utimes(filepath1, {
        'access': (now / 1000) - 2, // two seconds ago
        'modification': firstoct
    })
    .then(function(){
        var stats = statSync(filepath1);
        t.ok(stats.atime instanceof Date, 'atime instanceof Date');
        t.ok(stats.mtime instanceof Date, 'mtime instanceof Date');
        t.ok(stats.atime.getTime() > new Date(now - 3000).getTime(), 'access was 2 seconds ago');
        t.equal(stats.mtime.getTime(), firstoct.getTime(), 'modification was on 2015-10-01');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('utimes defaults to now', function(t){
    var before = new Date(Date.now() - 1000);

    file.utimes(filepath1)
    .then(function(){
        var stats = statSync(filepath1);
        t.ok(stats.atime >= before, 'access before');
        t.ok(stats.mtime >= before, 'modification before');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('utimes error', function(t){
    file.utimes(filepath1, {
        'access': '2015-10-01',
        'modification': '2015-10-01'
    })
    .then(function(){
        t.fail('should not futimes');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.end();
    });
});


tape('utimes fd error', function(t){
    file.utimes(-1)
    .then(function(){
        t.fail('should not futimes');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'futime', 'error.syscall is futime');
        t.end();
    });
});
