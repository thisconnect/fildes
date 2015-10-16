var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


tape('writeFile', function(t){
    var path = resolve(__dirname, './data/file.txt');

    file.writeFile(path, 'Hello File!')
    .then(function(){
        t.pass('file written');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('writeFile JSON', function(t){
    var path = resolve(__dirname, './data/file.json');

    file.writeFile(path, {data: 1})
    .then(function(){
        t.pass('JSON written');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('writeFile Buffer', function(t){
    var path = resolve(__dirname, './data/buffer.txt');

    file.writeFile(path, new Buffer('I\'m a buffer'))
    .then(function(){
        t.pass('Buffer written');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('write', function(t){
    var path = resolve(__dirname, './data/foo.txt');

    file.write(path, 'foo bar baz')
    .then(function(){
        t.pass('file written');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('write JSON', function(t){
    var path = resolve(__dirname, './data/data.json');

    file.write(path, {'data': 1})
    .then(function(){
        t.pass('file written');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('write buffer', function(t){
    var path = resolve(__dirname, './data/hi.txt');

    file.write(path, new Buffer('Hi!'), {
        'offset': 0,
        'length': 3
    })
    .then(function(){
        t.pass('file written');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('write buffer at position', function(t){
    var path = resolve(__dirname, './data/foo.txt');

    file.write(path, new Buffer('bOz'), {
        'offset': 0,
        'length': 3,
        'position': 8
    })
    .then(function(){
        t.pass('file written');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


// by now files contain
// data/file.txt = Hello File!
// data/file.json = {"data":1}
// data/buffer.txt = I'm a buffer
// data/data.json = {"data":1}
// data/foo.txt = foo bar bOz
// data/hi.txt  = Hi!
