var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/unlink.txt');


tape('setup unlink', function(t){
    writeFileSync(filepath1, 'file content\n');
    t.end();
});


tape('unlink', function(t){
    file.unlink(filepath1)
    .then(function(){
        t.pass('file deleted');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('unlink non-existing file', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.unlink(path)
    .then(function(){
        t.fail('should not unlink non-existing file');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
        t.equal(error.syscall, 'unlink', 'error.syscall is unlink');
        t.equal(error.path, path);
        t.end();
    });
});
