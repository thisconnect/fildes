'use strict';

const fs = require('fs');

module.exports = fd => {
  return new Promise((resolve, reject) => {
    fs.close(fd, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};
