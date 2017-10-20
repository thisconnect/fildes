'use strict';

const fs = require('fs');
const { open } = require('../open/index.js');
const close = require('../close/index.js');

const fchown = (fd, uid, gid) => {
  return new Promise((resolve, reject) => {
    fs.fchown(fd, uid, gid, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
module.exports = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    const uid = o.uid || (!!process.getuid && process.getuid());
    const gid = o.gid || (!!process.getgid && process.getgid());

    if (typeof path === 'number') {
      return fchown(fd, uid, gid);
    }

    return fchown(fd, uid, gid)
      .then(() => close(fd))
      .catch(err => {
        return close(fd).then(() => {
          throw err;
        });
      });
  });
};
