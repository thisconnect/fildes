'use strict';

const fs = require('fs');
const { open } = require('../open/index.js');
const close = require('../close/index.js');

const futimes = (fd, atime, mtime) => {
  return new Promise((resolve, reject) => {
    fs.futimes(fd, atime, mtime, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
module.exports = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    const atime = o.access || o.atime || new Date();
    const mtime = o.modification || o.mtime || new Date();
    if (typeof path === 'number') {
      return futimes(fd, atime, mtime);
    }

    return futimes(fd, atime, mtime)
      .then(() => close(fd))
      .catch(err => {
        return close(fd).then(() => {
          throw err;
        });
      });
  });
};
