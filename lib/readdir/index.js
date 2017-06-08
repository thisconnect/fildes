'use strict';

const fs = require('fs');

module.exports = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
};
