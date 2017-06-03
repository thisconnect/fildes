'use strict';

const fs = require('fs');
const { dirname } = require('path');
const mkdir = require('make-dir');

const open = (path, flags, mode) => {
  return new Promise((resolve, reject) => {
    if (typeof path == 'number') {
      return resolve(path);
    }
    fs.open(path, flags, mode, (err, fd) => {
      if (err) return reject(err);
      resolve(fd);
    });
  });
};

// 'w+' - Open file for reading and writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
module.exports = (path, o = {}) => {
  const flags = o.flag || o.flags || 'w+';
  let mode = o.mode;
  if (typeof mode == 'string') {
    mode = parseInt(mode, 8);
  }
  return open(path, flags, mode).catch(err => {
    if (!['w', 'w+', 'a', 'a+'].includes(flags)) {
      throw err;
    }
    return mkdir(dirname(path)).then(() => {
      return open(path, flags, mode);
    });
  });
};

module.exports.open = open;
