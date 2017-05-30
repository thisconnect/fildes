'use strict';

var fs = require('fs');
var dirname = require('path').dirname;
var mkdirp = require('mkdirp');
var debug = require('debug')('fildes:extra');

var mkdir = (dir, o) => {
  return new Promise((resolve, reject) => {
    mkdirp(dir, o, (err) => {
      debug(err || 'mkdirp');
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.mkdir = (dir, o) => {
  o = o || {};
  return mkdir(dir, o);
};

var writeFile = (path, data, o) => {
  return new Promise((resolve, reject) => {
    if (typeof data == 'object' && !Buffer.isBuffer(data)) {
      data = JSON.stringify(data);
    }
    fs.writeFile(path, data, o, (err) => {
      debug(err || 'fs.writeFile');
      if (err) reject(err);
      resolve();
    });
  });
};

exports.writeFile = (path, data, o) => {
  o = o || {};
  return writeFile(path, data, o).catch((err) => {
    if (err.code != 'ENOENT') {
      throw err;
    }
    return mkdir(dirname(path)).then(() => {
      return writeFile(path, data, o);
    });
  });
};

exports.readFile = (path, o) => {
  o = o || {};
  return new Promise((resolve, reject) => {
    fs.readFile(path, o, (err, data) => {
      debug(err || 'fs.readFile');
      if (err) reject(err);
      resolve(data);
    });
  });
};

exports.appendFile = (path, data, o) => {
  o = o || {};
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, o, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

exports.unlink = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      debug(err || 'fs.unlink');
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.readdir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
};

exports.rename = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
