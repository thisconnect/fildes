var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/link.txt');
var filepath2 = resolve(__dirname, './data/link/link.txt');
var filepath3 = resolve(__dirname, './data/link/link2.txt');


tape('setup link', function(t){
    writeFileSync(filepath1, 'link test\n');
    t.end();
});


tape('link', function(t){
    file.link(filepath1, filepath2)
    .then(function(){
        t.pass('file linked');
        return file.readFile(filepath2, {encoding: 'utf8'});
    })
    .then(function(content){
        t.equal(content, 'link test\n', 'link2 has content of file1');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('link link', function(t){
    file.link(filepath2, filepath3)
    .then(function(){
        t.pass('file linked');
        return file.write(filepath1, 'changed\n');
    })
    .then(function(){
        return file.readFile(filepath3, {encoding: 'utf8'});
    })
    .then(function(content){
        t.equal(content, 'changed\n', 'link3 has content of file1');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('link without src', function(t){
    var src = resolve(__dirname, './data/not/here.txt');
    file.link(src, filepath2)
    .then(function(){
        t.fail('should not link');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.ok(error instanceof Error, 'is Error');
        t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
        t.equal(error.syscall, 'access', 'error.syscal is access');
        t.end();
    });
});


tape('link dest error', function(t){
    var dest = resolve(__dirname, './data/link/link.txt/sub/not/work.txt');
    file.link(filepath1, dest)
    .then(function(){
        t.fail('should not link');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.ok(error instanceof Error, 'is Error');
        t.ok(/^(ENOTDIR|EEXIST)$/.test(error.code), 'error.code is ENOENT (or EEXIST on Windows)');
        t.equal(error.syscall, 'mkdir', 'error.syscal is mkdir');
        t.end();
    });
});
