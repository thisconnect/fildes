var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;


tape('writeFile', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.writeFile(path, 'Hello File!')
    .then(function(){
        t.pass('file written');
        t.equal(readFileSync(path, 'utf8'), 'Hello File!');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('writeFile JSON', function(t){
    var path = resolve(__dirname, './data/file.json');

    file.writeFile(path, {data: 1})
    .then(function(){
        t.pass('JSON written');
        t.equal(readFileSync(path, 'utf8'), '{"data":1}');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('writeFile Buffer', function(t){
    var path = resolve(__dirname, './data/buffer.txt');

    file.writeFile(path, new Buffer('I\'m a buffer'))
    .then(function(){
        t.pass('Buffer written');
        t.equal(readFileSync(path, 'utf8'), 'I\'m a buffer');
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
