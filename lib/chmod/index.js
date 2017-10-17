'use strict';

const fs = require('fs');
const { open } = require('../open/index.js');
const close = require('../close/index.js');

const fchmod = (fd, mode) => {
  return new Promise((resolve, reject) => {
    fs.fchmod(fd, mode, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
module.exports = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    const mode = typeof o.mode === 'string' ? parseInt(o.mode, 8) : o.mode;

    if (typeof path === 'number') {
      return fchmod(fd, mode);
    }

    return fchmod(fd, mode)
      .then(() => close(fd))
      .catch(err => {
        return close(fd).then(() => {
          throw err;
        });
      });
  });
};
