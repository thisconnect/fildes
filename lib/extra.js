'use strict';

const fs = require('fs');
const dirname = require('path').dirname;
const mkdirp = require('mkdirp');

const mkdir = (dir, o) => {
  return new Promise((resolve, reject) => {
    mkdirp(dir, o, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.mkdir = (dir, o = {}) => {
  return mkdir(dir, o);
};

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

exports.writeFile = (path, data, o = {}) => {
  return writeFile(path, data, o).catch(err => {
    if (err.code != 'ENOENT') {
      throw err;
    }
    return mkdir(dirname(path)).then(() => {
      return writeFile(path, data, o);
    });
  });
};

exports.readFile = (path, o = {}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, o, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

exports.appendFile = (path, data, o = {}) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, o, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.unlink = path => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.readdir = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
};

exports.rename = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};
