var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var statSync = require('fs').statSync;

function isPermission(mode, permission){
    mode = '0' + (mode & parseInt('0777', 8)).toString(8);
    return mode === permission;
}

tape('chmod', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.chmod(path, {
        'mode': '0700' // nobody else
    })
    .then(function(){
        var stats = statSync(path);
        t.ok(isPermission(stats.mode, '0700'), 'permission set to 0700');

        return file.chmod(path, {
            'mode': 0755
        });
    })
    .then(function(){
        var stats = statSync(path);
        t.ok(isPermission(stats.mode, '0755'), 'permission set to 0755');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('chmod error', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.chmod(-1, {
        mode: '0777'
    })
    .then(function(){
        t.fail('should not chmod');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'fchmod', 'error.syscal is fchmod');
        t.end();
    });
});

tape('chmod error 2', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.chmod(path)
    .then(function(){
        t.fail('should not chmod');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.ok(error instanceof TypeError, 'is TypeError');
        t.end();
    });
});
