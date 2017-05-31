'use strict';

const fs = require('fs');
const dirname = require('path').dirname;
const extra = require('./extra.js');
const debug = require('debug')('fildes');

const open = (path, flags, mode) => {
  return new Promise((resolve, reject) => {
    if (typeof path == 'number') {
      return resolve(path);
    }
    debug('open -%s %s', flags, path);
    fs.open(path, flags, mode, (err, fd) => {
      debug('open %s', err || fd);
      if (err) {
        return reject(err);
      }
      resolve(fd);
    });
  });
};

// 'w+' - Open file for reading and writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
exports.open = (path, o = {}) => {
  const flags = o.flag || o.flags || 'w+';
  let mode = o.mode;
  if (typeof mode == 'string') {
    mode = parseInt(mode, 8);
  }
  return open(path, flags, mode).catch(err => {
    if (['w', 'w+', 'a', 'a+'].indexOf(flags) == -1) {
      throw err;
    }
    return extra.mkdir(dirname(path)).then(() => {
      return open(path, flags, mode);
    });
  });
};

const close = fd => {
  return new Promise((resolve, reject) => {
    fs.close(fd, err => {
      debug('fs.close %s', err || '');
      if (err) return reject(err);
      resolve();
    });
  });
};

function finish(fd, path) {
  if (typeof path == 'number') {
    return Promise.resolve();
  }
  return close(fd);
}

exports.close = close;

const writeBuffer = (fd, buffer, offset, length, position) => {
  return new Promise((resolve, reject) => {
    debug('fs.write buffer offset %d, length %d', offset, length);
    fs.write(fd, buffer, offset, length, position, (err, written, buffer) => {
      if (err) {
        debug(err);
        reject(err);
      }
      resolve();
    });
  });
};

const writeData = (fd, data, position, encoding) => {
  return new Promise((resolve, reject) => {
    if (typeof data == 'object') {
      data = JSON.stringify(data);
    }
    debug('fs.write data');
    fs.write(fd, data, position, encoding, (err, written, string) => {
      if (err) {
        debug(err);
        return reject(err);
      }
      resolve();
    });
  });
};

const write = (fd, data, o) => {
  if (Buffer.isBuffer(data)) {
    return writeBuffer(fd, data, o.offset, o.length, o.position);
  }
  return writeData(fd, data, o.position, o.encoding);
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
// 'w' - Open file for writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
exports.write = (path, data, o = {}) => {
  const flags = o.flag || o.flags || (o.position > 0 ? 'r+' : 'w');

  return exports
    .open(path, {
      flags: flags,
      mode: o.mode
    })
    .then(fd => {
      return write(fd, data, o)
        .then(() => {
          return finish(fd, path);
        })
        .catch(err => {
          return finish(fd, path).then(() => {
            throw err;
          });
        });
    });
};

const read = (fd, buffer, offset, length, position, encoding) => {
  return new Promise((resolve, reject) => {
    debug(
      'fs.read (offset %d, length %d, position %d)',
      offset,
      length,
      position
    );
    fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
      if (err) {
        debug(err);
        return reject(err);
      }
      if (bytesRead < length) {
        buffer = buffer.slice(0, bytesRead);
      }
      if (encoding) {
        buffer = buffer.toString(encoding);
      }
      resolve(buffer);
    });
  });
};

// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
exports.read = (path, buffer, o) => {
  const hasBuffer = Buffer.isBuffer(buffer);
  o = (hasBuffer ? o : buffer) || {};
  if (!o.length) return Promise.reject(new TypeError('length is required'));
  if (!hasBuffer) buffer = new Buffer(o.length + (o.offset || 0));

  return open(path, o.flag || o.flags || 'r').then(fd => {
    return read(fd, buffer, o.offset || 0, o.length, o.position, o.encoding)
      .then(buf => {
        return finish(fd, path).then(() => {
          return buf;
        });
      })
      .catch(err => {
        return finish(fd, path).then(() => {
          throw err;
        });
      });
  });
};

const fstat = fd => {
  return new Promise((resolve, reject) => {
    debug('fs.fstat');
    fs.fstat(fd, (err, stats) => {
      if (err) return reject(err);
      resolve(stats);
    });
  });
};

// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
exports.stats = exports.fstat = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r').then(fd => {
    return fstat(fd)
      .then(stats => {
        return finish(fd, path).then(() => {
          return stats;
        });
      })
      .catch(err => {
        return finish(fd, path).then(() => {
          throw err;
        });
      });
  });
};

const ftruncate = (fd, length) => {
  return new Promise((resolve, reject) => {
    debug('fs.ftruncate');
    fs.ftruncate(fd, length, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.truncate = exports.ftruncate = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    return ftruncate(fd, o.length || o.len || 0)
      .then(() => {
        return finish(fd, path);
      })
      .catch(err => {
        return finish(fd, path).then(() => {
          throw err;
        });
      });
  });
};

const futimes = (fd, atime, mtime) => {
  return new Promise((resolve, reject) => {
    debug('fs.futimes');
    fs.futimes(fd, atime, mtime, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.utimes = exports.futimes = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    const atime = o.access || o.atime || new Date();
    const mtime = o.modification || o.mtime || new Date();
    return futimes(fd, atime, mtime)
      .then(() => {
        return finish(fd, path);
      })
      .catch(err => {
        return finish(fd, path).then(() => {
          throw err;
        });
      });
  });
};

const fchmod = (fd, mode) => {
  return new Promise((resolve, reject) => {
    debug('fs.fchmod', mode);
    fs.fchmod(fd, mode, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.chmod = exports.fchmod = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    const mode = typeof o.mode == 'string' ? parseInt(o.mode, 8) : o.mode;
    return fchmod(fd, mode)
      .then(() => {
        return finish(fd, path);
      })
      .catch(err => {
        return finish(fd, path).then(() => {
          throw err;
        });
      });
  });
};

const fchown = (fd, uid, gid) => {
  return new Promise((resolve, reject) => {
    debug('fchown', uid, gid);
    fs.fchown(fd, uid, gid, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.chown = exports.fchown = (path, o = {}) => {
  return open(path, o.flag || o.flags || 'r+').then(fd => {
    const mode = o.mode;
    const uid = o.uid || (!!process.getuid && process.getuid());
    const gid = o.gid || (!!process.getgid && process.getgid());

    return fchown(fd, uid, gid)
      .then(() => {
        return finish(fd, path);
      })
      .catch(err => {
        return finish(fd, path).then(() => {
          throw err;
        });
      });
  });
};

exports.fsync = exports.sync = fd => {
  return new Promise((resolve, reject) => {
    debug('fsync');
    fs.fsync(fd, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const access = (path, mode) => {
  return new Promise((resolve, reject) => {
    debug('access');
    fs.access(path, mode || fs.F_OK, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const modes = {
  r: fs.R_OK,
  rw: fs.R_OK | fs.W_OK,
  rwx: fs.R_OK | fs.W_OK | fs.X_OK,
  rx: fs.R_OK | fs.X_OK,
  w: fs.W_OK,
  wx: fs.W_OK | fs.X_OK,
  x: fs.X_OK
};

exports.access = (path, o) => {
  let mode = !o ? fs.F_OK : o.mode || o;
  if (mode in modes) mode = modes[mode];
  return access(path, mode);
};

const link = (src, dest) => {
  return new Promise((resolve, reject) => {
    debug('link');
    fs.link(src, dest, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.link = (src, dest) => {
  return access(src).then(() => {
    return link(src, dest).catch(err => {
      return extra.mkdir(dirname(dest)).then(() => {
        return link(src, dest);
      });
    });
  });
};

const symlink = (dest, path) => {
  return new Promise((resolve, reject) => {
    debug('symlink');
    fs.symlink(dest, path, err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.symlink = (dest, path) => {
  return symlink(dest, path).catch(err => {
    return extra.mkdir(dirname(path)).then(() => {
      return symlink(dest, path);
    });
  });
};

exports.writeFile = extra.writeFile;
exports.readFile = extra.readFile;
exports.appendFile = extra.appendFile;
exports.unlink = extra.unlink;
exports.rename = extra.rename;
exports.readdir = extra.readdir;
exports.mkdir = extra.mkdir;
