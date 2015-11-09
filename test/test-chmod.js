var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var statSync = require('fs').statSync;
var writeFileSync = require('fs').writeFileSync;

var filepath = resolve(__dirname, './data/chmod.txt');

function isPermission(mode, permission){
    mode = '0' + (mode & parseInt('0777', 8)).toString(8);
    return mode === permission;
}


tape('setup', function(t){
    writeFileSync(filepath, 'chmod test\n');
    t.end();
});


tape('chmod', function(t){
    file.chmod(filepath, {
        'mode': '0700' // nobody else
    })
    .then(function(){
        var stats = statSync(filepath);
        t.ok(isPermission(stats.mode, '0700'), 'permission set to 0700');

        return file.chmod(filepath, {
            'mode': 0755
        });
    })
    .then(function(){
        var stats = statSync(filepath);
        t.ok(isPermission(stats.mode, '0755'), 'permission set to 0755');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('chmod error', function(t){
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

    file.chmod(filepath)
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
