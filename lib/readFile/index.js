'use strict';

const fs = require('fs');

module.exports = (path, o = {}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, o, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};
