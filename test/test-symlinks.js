var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var lstatSync = require('fs').lstatSync;
var writeFileSync = require('fs').writeFileSync;

var dest1 = resolve(__dirname, './data/symlink.txt');
var dest2 = resolve(__dirname, './data/symlink/dest.txt');
var filepath1 = resolve(__dirname, './data/symlink/symlink.txt');
var filepath2 = resolve(__dirname, './data/symlink/symlink2.txt');
var dir1 = resolve(__dirname, './data/symlink/dir1');
var dir2 = resolve(__dirname, './data/symlink/dir2');


tape('setup symlink', function(t){
    writeFileSync(dest1, 'symlink test\n');
    t.end();
});


tape('symlink', function(t){
    file.symlink(dest1, filepath1)
    .then(function(){
        t.pass('file symlinked');
        return file.readFile(filepath1, {encoding: 'utf8'});
    })
    .then(function(content){
        t.equal(content, 'symlink test\n', 'symlink has content of dest1');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('symlink dir', function(t){
    var file1 = resolve(dir1, 'file.txt');
    var file2 = resolve(dir2, 'file.txt');

    file.mkdir(dir1)
    .then(function(){
        return file.symlink(dir1, dir2);
    })
    .then(function(){
        return file.writeFile(file1, 'test in dir1');
    })
    .then(function(){
        t.pass('dir symlinked');
        return file.readdir(dir2);
    })
    .then(function(files){
        t.ok(Array.isArray(files), 'files is Array');
        t.ok(files.length == 1, 'has some files');
        t.equal(files[0], 'file.txt', 'dir 2 has file.txt');
        return file.readFile(file2, {encoding: 'utf8'});
    })
    .then(function(content){
        t.equal(content, 'test in dir1', 'has same content');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('symlink dest that doesnt exist yet', function(t){
    file.symlink(dest2, filepath2)
    .then(function(){
        t.pass('symlink created');
        t.ok(lstatSync(filepath2).isSymbolicLink(), 'is symbolic link');
        return file.readFile(filepath2);
    })
    .catch(function(){
        t.pass('no file there yet');
        return file.writeFile(dest2, 'text after symlink\n');
    })
    .then(function(){
        return file.readFile(filepath2, {encoding: 'utf8'});
    })
    .then(function(content){
        t.equal(content, 'text after symlink\n', 'symlink has content of dest2');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('symlink error', function(t){
    file.symlink(dest1, filepath1)
    .then(function(){
        t.fail('should not symlink');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.ok(error instanceof Error, 'instance of Error');
        t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
        t.equal(error.syscall, 'symlink', 'error.syscal is symlink');
        t.end();
    });
});
