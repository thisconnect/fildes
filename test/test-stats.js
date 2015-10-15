var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;


tape('fstat', function(t){
    var path = resolve(__dirname, './data/hi.txt');

    file.fstat(path)
    .then(function(stats){
        t.equal(stats.size, 3);
        t.pass('stats received');
        t.end();
    })
    .catch(function(error){
        t.fail(error);
    });
});
