'use strict';

const fs = require('fs');
const { open } = require('../open/index.js');
const close = require('../close/index.js');

const fstat = fd => {
  return new Promise((resolve, reject) => {
    fs.fstat(fd, (err, stats) => {
      if (err) return reject(err);
      resolve(stats);
    });
  });
};

// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
module.exports = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r').then(fd => {
    if (typeof path === 'number') {
      return fstat(fd);
    }

    return fstat(fd)
      .then(stats => {
        return close(fd).then(() => stats);
      })
      .catch(err => {
        return close(fd).then(() => {
          throw err;
        });
      });
  });
};
