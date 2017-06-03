'use strict';

const fs = require('fs');

module.exports = path => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};
