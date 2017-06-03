'use strict';

const fs = require('fs');

module.exports = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};
