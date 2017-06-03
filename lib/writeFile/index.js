'use strict';

const fs = require('fs');
const { dirname } = require('path');
const mkdir = require('make-dir');

const writeFile = (path, data, o) => {
  return new Promise((resolve, reject) => {
    if (typeof data == 'object' && !Buffer.isBuffer(data)) {
      data = JSON.stringify(data);
    }
    fs.writeFile(path, data, o, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = (path, data, o = {}) => {
  return writeFile(path, data, o).catch(err => {
    if (err.code != 'ENOENT') {
      throw err;
    }
    return mkdir(dirname(path)).then(() => {
      return writeFile(path, data, o);
    });
  });
};
