'use strict';

const fs = require('fs');
const { open } = require('../open/index.js');
const close = require('../close/index.js');

const read = (fd, buffer, offset, length, position, encoding) => {
  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
      if (err) return reject(err);
      if (bytesRead < length) {
        buffer = buffer.slice(0, bytesRead);
      }
      if (encoding) {
        buffer = buffer.toString(encoding);
      }
      resolve(buffer);
    });
  });
};

// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
module.exports = (path, buffer, o) => {
  const hasBuffer = Buffer.isBuffer(buffer);
  o = (hasBuffer ? o : buffer) || {};
  if (!o.length) return Promise.reject(new TypeError('length is required'));
  if (!hasBuffer) buffer = Buffer.alloc(o.length + (o.offset || 0));

  return open(path, o.flag || o.flags || 'r').then(fd => {
    if (typeof path === 'number') {
      return read(fd, buffer, o.offset || 0, o.length, o.position, o.encoding);
    }

    return read(fd, buffer, o.offset || 0, o.length, o.position, o.encoding)
      .then(buf => close(fd).then(() => buf))
      .catch(err => {
        return close(fd).then(() => {
          throw err;
        });
      });
  });
};
