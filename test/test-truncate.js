var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/truncate.txt');


tape('setup truncate', function(t){
    writeFileSync(filepath1, 'abcdefghijklmnopqrstuvwxyz\n');
    t.end();
});


tape('truncate', function(t){
    file.truncate(filepath1, {
        'length': 9
    })
    .then(function(){
        var text = readFileSync(filepath1, 'utf8');
        t.equal(text.length, 9, 'text.length is 9');
        t.equal(text, 'abcdefghi');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('truncate all', function(t){
    file.truncate(filepath1)
    .then(function(){
        var text = readFileSync(filepath1, 'utf8');
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
    file.truncate(filepath1, {
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
