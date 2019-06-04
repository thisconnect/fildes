const fs = require('fs');
const { dirname } = require('path');
const mkdir = require('make-dir');
const access = require('../access/index.js');

const link = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.link(src, dest, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = (src, dest) => {
  console.log(1, src, dest)
  return access(src).then(() => {
    console.log(2)
    return link(src, dest).catch(() => {
      console.log(3)
      return mkdir(dirname(dest)).then(() => {
        console.log(4)
        return link(src, dest);
      });
    });
  });
};
