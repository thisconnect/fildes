var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;

tape('truncate', function(t){
    var path = resolve(__dirname, './data/buffer.txt');

    file.truncate(path, {
        'length': 9
    })
    .then(function(){
        var text = readFileSync(path, 'utf8');
        t.equal(text.length, 9, 'text.length is 9');
        t.equal(text, 'I\'m a buf');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('truncate all', function(t){
    var path = resolve(__dirname, './data/buffer.txt');

    file.truncate(path)
    .then(function(){
        var text = readFileSync(path, 'utf8');
        t.equal(text.length, 0, 'text.length is 0');
        t.equal(text, '');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('truncate error', function(t){
    var path = resolve(__dirname, './data/buffer.txt');

    file.truncate(path, {
        'length': -1
    })
    .then(function(){
        t.fail('should not truncate');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EINVAL', 'error.code is EINVAL');
        t.equal(error.syscall, 'ftruncate', 'error.syscall is ftruncate');
        t.end();
    });
});
