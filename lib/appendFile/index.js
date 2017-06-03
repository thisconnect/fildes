'use strict';

const fs = require('fs');

module.exports = (path, data, o = {}) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, o, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};
