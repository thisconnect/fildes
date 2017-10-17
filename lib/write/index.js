'use strict';

const fs = require('fs');
const open = require('../open/index.js');
const close = require('../close/index.js');

const writeBuffer = (fd, buffer, offset, length, position) => {
  return new Promise((resolve, reject) => {
    fs.write(fd, buffer, offset, length, position, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const writeData = (fd, data, position, encoding) => {
  return new Promise((resolve, reject) => {
    if (typeof data == 'object') {
      data = JSON.stringify(data);
    }
    fs.write(fd, data, position, encoding, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const write = (fd, data, o) => {
  if (Buffer.isBuffer(data)) {
    return writeBuffer(fd, data, o.offset, o.length, o.position);
  }
  return writeData(fd, data, o.position, o.encoding);
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
// 'w' - Open file for writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
module.exports = (path, data, o = {}) => {
  const flags = o.flag || o.flags || (o.position > 0 ? 'r+' : 'w');

  return open(path, { flags: flags, mode: o.mode }).then(fd => {
    if (typeof path === 'number') {
      return write(fd, data, o);
    }
    return write(fd, data, o)
      .then(() => close(fd))
      .catch(err => {
        return close(fd).then(() => {
          throw err;
        });
      });
  });
};
