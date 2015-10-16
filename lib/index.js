'use strict';

var fs = require('fs');
var cpy = require('cpy');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');


var open = function(path, flags, mode){
    mode = mode || '0666';
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

exports.open = function(path, o){
    o = o || {};
    return open(path, o.flags || 'r', o.mode);
};

var close = function(fd){
    return new Promise(function(resolve, reject){
        fs.close(fd, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};

var onError = function(fd, err){
    return close(fd)
    .then(function(){
        throw err;
    })
    .catch(function(err){
        throw err;
    });
};

var writeBuffer = function(fd, data, offset, length, position){
    return new Promise(function(resolve, reject){
        fs.write(fd, data, offset, length, position, function(err, written, buffer){
            if (err) reject(err);
            resolve(written);
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
            resolve(written);
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
            return close(fd);
        })
        .catch(function(err){
            return onError(fd, err);
        });
    });
};

exports.writeFile = function(path, data, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        if (typeof data == 'object' && !Buffer.isBuffer(data)){
            data = JSON.stringify(data);
        }
        fs.writeFile(path, data, o, function(err){
            if (err) reject(err);
            resolve();
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
            return close(fd);
        })
        .catch(function(err){
            return onError(fd, err);
        });
    });
};

exports.readFile = function(path, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        fs.readFile(path, o, function(err, data){
            if (err) reject(err);
            resolve(data);
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

exports.fstat = function(path, o){
    o = o || {};

    return open(path, o.flags || 'r')
    .then(function(fd){
        return fstat(fd)
        .then(function(stats){
            return close(fd)
            .then(function(){
                return stats;
            });
        })
        .catch(function(err){
            return onError(fd, err);
        });
    });

};

exports.unlink = function(path){
    return new Promise(function(resolve, reject){
        fs.unlink(path, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};

exports.mkdir = function(dir){
    return new Promise(function(resolve, reject){
        mkdirp(dir, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};

exports.rmdir = function(dir){
    return new Promise(function(resolve, reject){
        rimraf(dir, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};

exports.copy = exports.cp = function(files, destination, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        cpy(files, destination, o, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};
