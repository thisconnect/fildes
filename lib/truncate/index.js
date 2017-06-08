'use strict';

const fs = require('fs');
const { open } = require('../open/index.js');
const close = require('../close/index.js');

const ftruncate = (fd, length) => {
  return new Promise((resolve, reject) => {
    fs.ftruncate(fd, length, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
module.exports = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    if (typeof path === 'number') {
      return ftruncate(fd, o.length || o.len || 0);
    }
    return ftruncate(fd, o.length || o.len || 0)
      .then(() => close(fd))
      .catch(err => {
        return close(fd).then(() => {
          throw err;
        });
      });
  });
};
