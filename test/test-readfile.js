var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/readfile.txt');


tape('setup truncate', function(t){
    writeFileSync(filepath1, '0123456789\n');
    t.end();
});


tape('readFile', function(t){
    file.readFile(filepath1)
    .then(function(buffer){
        t.ok(Buffer.isBuffer(buffer), 'is Buffer');
        t.deepEqual(buffer, new Buffer('0123456789\n'));
        t.pass('file read');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('readFile utf8', function(t){
    file.readFile(filepath1, {
        encoding: 'utf8'
    })
    .then(function(data){
        t.ok(typeof data == 'string', 'is String');
        t.equal(data, '0123456789\n');
        t.pass('file read');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('readFile non-existing file', function(t){
    var path = resolve(__dirname, './data/nothing-here.txt');

    file.readFile(path)
    .then(function(data){
        t.fail('should have no data');
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
