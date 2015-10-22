'use strict';

var fs = require('fs');
var comfort = require('./comfort.js');

var open = function(path, flags, mode){
    return new Promise(function(resolve, reject){
        if (typeof path == 'number'){
            return resolve(path);
        }
        fs.open(path, flags, mode, function(err, fd){
            if (err) return reject(err);
            resolve(fd);
        });
    });
};

// 'w+' - Open file for reading and writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
exports.open = function(path, o){
    o = o || {};
    return open(path, o.flags || 'w+', o.mode);
};

var close = function(fd){
    return new Promise(function(resolve, reject){
        fs.close(fd, function(err){
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
            if (err) reject(err);
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
            if (err) return reject(err);
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

exports.write = function(path, data, o){
    o = o || {};

    return open(path, o.flags || 'w')
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
            if (err) return reject(err);
            resolve(bytesRead);
        });
    });
};

exports.read = function(path, buffer, o){
    o = o || {};

    return open(path, o.flags || 'r')
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
            if (err) return reject(err);
            resolve(stats);
        });
    });
};

exports.stats = exports.fstat = function(path, o){
    o = o || {};

    return open(path, o.flags || 'r')
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

exports.writeFile = comfort.writeFile;
exports.readFile = comfort.readFile;
exports.unlink = comfort.unlink;
exports.mkdir = comfort.mkdir;
exports.rmdir = comfort.rmdir;
exports.copy = exports.cp = comfort.cp;
