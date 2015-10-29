var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var statSync = require('fs').statSync;

tape('utimes', function(t){
    var path = resolve(__dirname, './data/buffer.txt');

    var oneminago = Date.now() - (60 * 1000);
    var firstoct = new Date('2015-10-01');

    file.utimes(path, {
        'access': oneminago,
        'modification': firstoct
    })
    .then(function(){
        var stats = statSync(path);
        t.ok(stats.atime instanceof Date, 'atime instanceof Date');
        t.ok(stats.mtime instanceof Date, 'mtime instanceof Date');
        t.equal(Number(stats.atime) / 1000, oneminago, 'access was 1 min ago');
        t.equal(stats.mtime.toString(), firstoct.toString(), 'modification was on 2015-10-01');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('utimes defaults to now', function(t){
    var path = resolve(__dirname, './data/buffer.txt');

    var before = new Date(Date.now() - 1000);

    file.utimes(path)
    .then(function(){
        var stats = statSync(path);
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
    var path = resolve(__dirname, './data/buffer.txt');

    file.utimes(path, {
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
