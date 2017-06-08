'use strict';

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
  return access(src).then(() => {
    return link(src, dest).catch(() => {
      return mkdir(dirname(dest)).then(() => {
        return link(src, dest);
      });
    });
  });
};
