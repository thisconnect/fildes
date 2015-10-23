var fs = require('fs');
var cpy = require('cpy');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

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

exports.readFile = function(path, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        fs.readFile(path, o, function(err, data){
            if (err) reject(err);
            resolve(data);
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
            /* istanbul ignore if */
            if (err) return reject(err);
            resolve();
        });
    });
};

exports.cp = function(files, destination, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        cpy(files, destination, o, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};
