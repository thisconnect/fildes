var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


tape('mkdir', function(t){
    var path = resolve(__dirname, './data/a/new/dir');

    file.mkdir(path)
    .then(function(data){
        t.pass('dir created');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('mkdir error', function(t){
    file.mkdir(-1)
    .then(function(data){
        t.fail('dir deleted');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.ok(error instanceof TypeError, 'is TypeError');
        t.end();
    });
});

tape('rmdir', function(t){
    var path = resolve(__dirname, './data/a/new/dir');

    file.rmdir(path)
    .then(function(data){
        t.pass('dir deleted');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('rmdir error', function(t){
    file.rmdir(-1)
    .then(function(data){
        t.fail('dir deleted');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error.message);
        t.end();
    });
});

tape('cp', function(t){
    var files = resolve(__dirname, './data/*.txt');
    var destination = resolve(__dirname, './data/a');

    file.copy([files], destination)
    .then(function(data){
        t.pass('copied');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});

tape('cp error', function(t){
    var files = resolve(__dirname, './data/*');
    var destination = resolve(__dirname, './data/a');

    file.copy([files], destination)
    .then(function(data){
        t.fail('copied');
        t.end();
    })
    .catch(function(error){
        t.ok(error, 'has Error');
        t.end();
    });
});
