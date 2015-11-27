var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;

var file1 = resolve(__dirname, './data/writefile-1.txt');
var file2 = resolve(__dirname, './data/writefile-2.json');
var file3 = resolve(__dirname, './data/writefile-3.txt');


tape('writeFile', function(t){
    file.writeFile(file1, 'Hello File!')
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(file1, 'utf8'), 'Hello File!');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('writeFile JSON', function(t){
    file.writeFile(file2, {data: 1})
    .then(function(){
        t.pass('JSON written');
        t.equal(readFileSync(file2, 'utf8'), '{"data":1}');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('writeFile Buffer', function(t){
    file.writeFile(file3, new Buffer('I\'m a buffer'))
    .then(function(){
        t.pass('Buffer written');
        t.equal(readFileSync(file3, 'utf8'), 'I\'m a buffer');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('writeFile error', function(t){
    var path = resolve(__dirname, './data/no/file/here.txt');

    file.writeFile(path, 'nothing')
    .then(function(){
        t.fail('should not write');
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
