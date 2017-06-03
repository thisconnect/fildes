'use strict';

const fs = require('fs');

const modes = {
  r: fs.R_OK,
  rw: fs.R_OK | fs.W_OK,
  rwx: fs.R_OK | fs.W_OK | fs.X_OK,
  rx: fs.R_OK | fs.X_OK,
  w: fs.W_OK,
  wx: fs.W_OK | fs.X_OK,
  x: fs.X_OK
};

const access = (path, mode) => {
  return new Promise((resolve, reject) => {
    fs.access(path, mode || fs.F_OK, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = (path, o) => {
  let mode = !o ? fs.F_OK : o.mode || o;
  if (mode in modes) mode = modes[mode];
  return access(path, mode);
};
