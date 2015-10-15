'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');


var open = function(path, flags, mode){
    mode = mode || '0666';
    return new Promise(function(resolve, reject){
        if (!flags) return reject(Error('flags'));
        fs.open(path, flags, mode, function(err, fd){
            if (!!err) return reject(err);
            resolve(fd);
        });
    });
};

var close = function(fd){
    return new Promise(function(resolve, reject){
        fs.close(fd, function(err){
            if (!!err) return reject(err);
            resolve();
        });
    });
};

var writeBuffer = function(fd, data, offset, length, position){
    return new Promise(function(resolve, reject){
        fs.write(fd, data, offset, length, position, function(err, written, buffer){
            if (!!err) reject(err);
            resolve(written);
        });
    });
};

var writeData = function(fd, data, position, encoding){
    return new Promise(function(resolve, reject){
        fs.write(fd, data, position, encoding, function(err, written, string){
            if (!!err) return reject(err);
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
            return close(fd)
            .then(function(){
                throw new Error(err);
            });
        });
    });
};

var read = function(fd, buffer, offset, length, position){
    return new Promise(function(resolve, reject){
        fs.read(fd, buffer, offset, length, position, function(err, bytesRead, buffer){
            if (!!err) return reject(err);
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
            return close(fd)
            .then(function(){
                throw new Error(err);
            });
        });
    });
};

var fstat = function(fd){
    return new Promise(function(resolve, reject){
        fs.fstat(fd, function(err, stats){
            if (!!err) return reject(err);
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
            return close(fd)
            .then(function(){
                throw new Error(err);
            });
        });
    });

};

/*

var unlink = function(filepath){
    return new Promise(function(resolve, reject){
        fs.unlink(filepath, function(err){
            if (!!err) return reject(err);
            resolve();
        });
    });
};

var readFile = function(filepath){
    return new Promise(function(resolve, reject){
        fs.readFile(filepath, function(err, body){
            if (!!err) return reject(err);
            resolve(body);
        });
    });
};

var mkdir = function(dir){
    return new Promise(function(resolve, reject){
        mkdirp(dir, function(err){
            if (!!err) return reject(err);
            resolve(dir);
        });
    });
};

var rmdir = function(dir){
    return new Promise(function(resolve, reject){
        rimraf(dir, function(err){
            if (!!err) return reject(err);
            resolve();
        });
    });
};
*/
