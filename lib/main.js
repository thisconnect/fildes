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
        debug('open %s %s', flags, path);
        fs.open(path, flags, mode, function(err, fd){
            if (err){
                debug(err);
                return reject(err);
            }
            debug('fs.open %s %s', flags, mode || '');
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
            debug(err || 'fs.close %d', err ? '' : fd);
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
        fs.write(fd, buffer, offset, length, position, function(err, written, buffer){
            if (err){
                debug(err);
                reject(err);
            }
            debug('fs.write buffer %s (offset %d, length %d, position %d)',
                buffer, offset, length, position);
            resolve();
        });
    });
};

var writeData = function(fd, data, position, encoding){
    return new Promise(function(resolve, reject){
        if (typeof data == 'object'){
            data = JSON.stringify(data);
        }
        fs.write(fd, data, position, encoding, function(err, written, string){
            if (err){
                debug(err);
                return reject(err);
            }
            debug('fs.write data %s (position %d, encoding %s)',
                data, position, encoding);
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

var read = function(fd, buffer, offset, length, position){
    return new Promise(function(resolve, reject){
        fs.read(fd, buffer, offset, length, position, function(err, bytesRead, buffer){
            if (err){
                debug(err);
                return reject(err);
            }
            debug('fs.read (offset %d, length %d, position %d)',
                offset, length, position);
            resolve(bytesRead);
        });
    });
};

exports.read = function(path, buffer, o){
    o = o || {};

    return open(path, o.flag || o.flags || 'r')
    .then(function(fd){
        return read(fd, buffer, o.offset, o.length, o.position)
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

var fstat = function(fd){
    return new Promise(function(resolve, reject){
        fs.fstat(fd, function(err, stats){
            debug(err || 'fs.fstat');
            if (err) return reject(err);
            resolve(stats);
        });
    });
};

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
        fs.ftruncate(fd, length, function(err){
            debug(err || 'fs.ftruncate');
            if (err) return reject(err);
            resolve();
        });
    });
};

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
        fs.futimes(fd, atime, mtime, function(err){
            debug(err || 'fs.futimes');
            if (err) return reject(err);
            resolve();
        });
    });
};

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
        fs.fchmod(fd, mode, function(err){
            debug(err || 'fs.fchmod', mode);
            if (err) return reject(err);
            resolve();
        });
    });
};

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

exports.writeFile = extra.writeFile;
exports.readFile = extra.readFile;
exports.unlink = extra.unlink;
exports.mkdir = extra.mkdir;
exports.rmdir = extra.rmdir;
exports.copy = exports.cp = extra.cp;
