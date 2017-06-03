'use strict';

const fs = require('fs');

module.exports = exports.sync = fd => {
  return new Promise((resolve, reject) => {
    fs.fsync(fd, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};
