var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var dirpath1 = resolve(__dirname, './data/dir/dir/sub/subsub');
var dirpath2 = resolve(__dirname, './data/dir/dir/sub');
var filepath = resolve(__dirname, './data/dir.txt');


tape('setup dirs', function(t){
    writeFileSync(filepath, 'chmod test\n');
    t.end();
});


tape('mkdir', function(t){
    file.mkdir(dirpath1)
    .then(function(data){
        t.pass('dir created');
        t.end();
    })
    .catch(function(error){
        t.error(error);
        t.end();
    });
});


tape('mkdir on file', function(t){
    file.mkdir(filepath)
    .then(function(data){
        t.fail('dir created');
        t.end();
    })
    .catch(function(error){
        t.ok(error, error);
        t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
        t.equal(error.syscall, 'mkdir', 'error.syscall is mkdir');
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


tape('rm', function(t){
    file.rm(dirpath2)
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
    var destination = resolve(__dirname, './data/dir');

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
    var destination = resolve(__dirname, './data/dir');

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
