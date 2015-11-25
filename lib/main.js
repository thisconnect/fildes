'use strict';

var fs = require('fs');
var dirname = require('path').dirname;
var extra = require('./extra.js');
var debug = require('debug')('fildes');


var open = function(path, flags, mode){
    return new Promise(function(resolve, reject){
        if (typeof path == 'number'){
            return resolve(path);
        }
        debug('open -%s %s', flags, path);
        fs.open(path, flags, mode, function(err, fd){
            debug('open %s', err || fd);
            if (err){
                return reject(err);
            }
            resolve(fd);
        });
    });
};


// 'w+' - Open file for reading and writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
exports.open = function(path, o){
    o = o || {};
    var flags = o.flag || o.flags || 'w+';
    return open(path, flags, o.mode)
    .catch(function(err){
        if (['w', 'w+', 'a', 'a+'].indexOf(flags) == -1){
            throw err;
        }
        return extra.mkdir(dirname(path))
        .then(function(){
            return open(path, flags, o.mode);
        });
    });
};


var close = function(fd){
    return new Promise(function(resolve, reject){
        fs.close(fd, function(err){
            debug('fs.close %s', err || '');
            if (err) return reject(err);
            resolve();
        });
    });
};


function finish(fd, path){
    if (typeof path == 'number'){
        return Promise.resolve();
    }
    return close(fd);
}


exports.close = close;


var writeBuffer = function(fd, buffer, offset, length, position){
    return new Promise(function(resolve, reject){
        debug('fs.write buffer offset %d, length %d', offset, length);
        fs.write(fd, buffer, offset, length, position, function(err, written, buffer){
            if (err){
                debug(err);
                reject(err);
            }
            resolve();
        });
    });
};


var writeData = function(fd, data, position, encoding){
    return new Promise(function(resolve, reject){
        if (typeof data == 'object'){
            data = JSON.stringify(data);
        }
        debug('fs.write data');
        fs.write(fd, data, position, encoding, function(err, written, string){
            if (err){
                debug(err);
                return reject(err);
            }
            resolve();
        });
    });
};


var write = function(fd, data, o){
    if (Buffer.isBuffer(data)){
        return writeBuffer(fd, data, o.offset, o.length, o.position);
    }
    return writeData(fd, data, o.position, o.encoding);
};


// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
// 'w' - Open file for writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
exports.write = function(path, data, o){
    o = o || {};
    var flags = o.flag || o.flags || (o.position > 0 ? 'r+' : 'w');

    return exports.open(path, {
        'flags': flags,
        'mode': o.mode
    })
    .then(function(fd){
        return write(fd, data, o)
        .then(function(){
            return finish(fd, path);
        })
        .catch(function(err){
            return finish(fd, path)
            .then(function(){
                throw err;
            });
        });
    });
};


var read = function(fd, buffer, offset, length, position, encoding){
    return new Promise(function(resolve, reject){
        debug('fs.read (offset %d, length %d, position %d)',
            offset, length, position);
        fs.read(fd, buffer, offset, length, position, function(err, bytesRead, buffer){
            if (err){
                debug(err);
                return reject(err);
            }
            if (bytesRead < length){
                buffer = buffer.slice(0, bytesRead);
            }
            if (encoding){
                buffer = buffer.toString(encoding);
            }
            resolve(buffer);
        });
    });
};


// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
exports.read = function(path, buffer, o){
    var hasBuffer = Buffer.isBuffer(buffer);
    o = (hasBuffer ? o : buffer) || {};
    if (!o.length) return Promise.reject(new TypeError('length is required'));
    if (!hasBuffer) buffer = new Buffer(o.length + (o.offset || 0));

    return open(path, o.flag || o.flags || 'r')
    .then(function(fd){
        return read(fd, buffer, o.offset || 0, o.length, o.position, o.encoding)
        .then(function(buf){
            return finish(fd, path)
            .then(function(){
                return buf;
            });
        })
        .catch(function(err){
            return finish(fd, path)
            .then(function(){
                throw err;
            });
        });
    });
};


var fstat = function(fd){
    return new Promise(function(resolve, reject){
        debug('fs.fstat');
        fs.fstat(fd, function(err, stats){
            if (err) return reject(err);
            resolve(stats);
        });
    });
};


// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
exports.stats = exports.fstat = function(path, o){
    o = o || {};
    return open(path, o.flag || o.flags || 'r')
    .then(function(fd){
        return fstat(fd)
        .then(function(stats){
            return finish(fd, path)
            .then(function(){
                return stats;
            });
        })
        .catch(function(err){
            return finish(fd, path)
            .then(function(){
                throw err;
            });
        });
    });
};


var ftruncate = function(fd, length){
    return new Promise(function(resolve, reject){
        debug('fs.ftruncate');
        fs.ftruncate(fd, length, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.truncate = exports.ftruncate = function(path, o){
    o = o || {};
    return open(path, o.flag || o.flags || 'r+')
    .then(function(fd){
        return ftruncate(fd, o.length || o.len || 0)
        .then(function(){
            return finish(fd, path);
        })
        .catch(function(err){
            return finish(fd, path)
            .then(function(){
                throw err;
            });
        });
    });
};


var futimes = function(fd, atime, mtime){
    return new Promise(function(resolve, reject){
        debug('fs.futimes');
        fs.futimes(fd, atime, mtime, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.utimes = exports.futimes = function(path, o){
    o = o || {};
    return open(path, o.flag || o.flags || 'r+')
    .then(function(fd){
        var atime = o.access || o.atime || new Date();
        var mtime = o.modification || o.mtime || new Date();
        return futimes(fd, atime, mtime)
        .then(function(){
            return finish(fd, path);
        })
        .catch(function(err){
            return finish(fd, path)
            .then(function(){
                throw err;
            });
        });
    });
};


var fchmod = function(fd, mode){
    return new Promise(function(resolve, reject){
        debug('fs.fchmod', mode);
        fs.fchmod(fd, mode, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.chmod = exports.fchmod = function(path, o){
    o = o || {};
    return open(path, o.flag || o.flags || 'r+')
    .then(function(fd){
        var mode = o.mode;
        if (typeof mode == 'string'){
            mode = parseInt(mode, 8);
        }
        return fchmod(fd, mode)
        .then(function(){
            return finish(fd, path);
        })
        .catch(function(err){
            return finish(fd, path)
            .then(function(){
                throw err;
            });
        });
    });
};


var fchown = function(fd, uid, gid){
    return new Promise(function(resolve, reject){
        debug('fchown', uid, gid);
        fs.fchown(fd, uid, gid, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


// 'r+' - Open file for reading and writing.
// An exception occurs if the file does not exist
exports.chown = exports.fchown = function(path, o){
    o = o || {};
    return open(path, o.flag || o.flags || 'r+')
    .then(function(fd){
        var mode = o.mode;
        var uid = o.uid || process.getuid();
        var gid = o.gid || process.getgid();

        return fchown(fd, uid, gid)
        .then(function(){
            return finish(fd, path);
        })
        .catch(function(err){
            return finish(fd, path)
            .then(function(){
                throw err;
            });
        });
    });
};


exports.fsync = exports.sync = function(fd){
    return new Promise(function(resolve, reject){
        debug('fsync');
        fs.fsync(fd, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


var access = function(path, mode){
    mode = mode || fs.F_OK;
    return new Promise(function(resolve, reject){
        debug('access');
        fs.access(path, mode, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


var link = function(src, dest){
    return new Promise(function(resolve, reject){
        debug('link');
        fs.link(src, dest, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


exports.link = function(src, dest){
    return access(src)
    .then(function(){
        return link(src, dest)
        .catch(function(err){
            return extra.mkdir(dirname(dest))
            .then(function(){
                return link(src, dest);
            });
        });
    });
};

var symlink = function(dest, path, type){
    return new Promise(function(resolve, reject){
        debug('symlink');
        fs.symlink(dest, path, type, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


exports.symlink = function(dest, path){
    return symlink(dest, path)
    .catch(function(err){
        return extra.mkdir(dirname(path))
        .then(function(){
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
exports.rm = exports.rmdir = extra.rmdir;
exports.copy = exports.cp = extra.cp;
