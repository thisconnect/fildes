var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var writeFileSync = require('fs').writeFileSync;

var filepath = resolve(__dirname, './data/append.txt');


tape('setup append', function(t){
    writeFileSync(filepath, 'abc');
    t.end();
});


tape('append', function(t){
    file.appendFile(filepath, 'def')
    .then(function(){
        t.pass('appended data');
        t.equal(readFileSync(filepath, 'utf8'), 'abcdef');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('append a buffer', function(t){
    file.appendFile(filepath, new Buffer('ghi'))
    .then(function(){
        t.pass('appended data');
        t.equal(readFileSync(filepath, 'utf8'), 'abcdefghi');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('append error', function(t){
    file.appendFile(filepath, '', {
        flag: 'r'
    })
    .then(function(){
        t.fail('should not truncate');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.end();
    });
});
