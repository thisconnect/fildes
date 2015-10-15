var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


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
// data/foo.txt = foo bar bOz
// data/hi.txt  = Hi!


tape('read', function(t){
    var path = resolve(__dirname, './data/hi.txt');

    var buffer = new Buffer(3);
    file.read(path, buffer, {
        'offset': 0,
        'length': 3
    })
    .then(function(){
        t.equal(buffer.toString(), 'Hi!');
        t.pass('file read');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});


tape('read partly', function(t){
    var path = resolve(__dirname, './data/foo.txt');

    var buffer = new Buffer(3);
    file.read(path, buffer, {
        'offset': 0,
        'length': 3,
        'position': 8
    })
    .then(function(){
        t.equal(buffer.toString(), 'bOz');
        t.pass('file partly read');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});
