var file = require('../');

var tape = require('tape');
var rimraf = require('rimraf');
var resolve = require('path').resolve;

tape('setup', t => {
  var path = resolve(__dirname, './data');

  rimraf(path, error => {
    if (error) {
      t.error(error);
      t.end();
    }
    file
      .mkdir(path)
      .then(() => {
        t.end();
      })
      .catch(error => {
        t.error(error);
        t.end();
      });
  });
});

require('./open.test.js');
require('./writefile.test.js');
require('./write.test.js');
require('./read.test.js');
require('./readfile.test.js');
require('./access.test.js');
require('./stats.test.js');
require('./append.test.js');
require('./truncate.test.js');
require('./utimes.test.js');
require('./chmod.test.js');
require('./chown.test.js');
require('./sync.test.js');
require('./unlink.test.js');
require('./rename.test.js');
require('./links.test.js');
require('./symlinks.test.js');
require('./dir.test.js');

// require('./test-functions.js');
