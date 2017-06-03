'use strict';

const fs = require('fs');
const { dirname } = require('path');
const mkdir = require('make-dir');

const symlink = (dest, path) => {
  return new Promise((resolve, reject) => {
    fs.symlink(dest, path, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = (dest, path) => {
  return symlink(dest, path).catch(() => {
    return mkdir(dirname(path)).then(() => {
      return symlink(dest, path);
    });
  });
};
