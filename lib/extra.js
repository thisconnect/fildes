'use strict';

var fs = require('fs');
var cpy = require('cpy');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var debug = require('debug')('fildes:extra');


exports.writeFile = function(path, data, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        if (typeof data == 'object' && !Buffer.isBuffer(data)){
            data = JSON.stringify(data);
        }
        fs.writeFile(path, data, o, function(err){
            debug(err || 'fs.writeFile');
            if (err) reject(err);
            resolve();
        });
    });
};


exports.readFile = function(path, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        fs.readFile(path, o, function(err, data){
            debug(err || 'fs.readFile');
            if (err) reject(err);
            resolve(data);
        });
    });
};


exports.appendFile = function(path, data, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        fs.appendFile(path, data, o, function(err){
            if (err) reject(err);
            resolve();
        });
    });
};


exports.unlink = function(path){
    return new Promise(function(resolve, reject){
        fs.unlink(path, function(err){
            debug(err || 'fs.unlink');
            if (err) return reject(err);
            resolve();
        });
    });
};


exports.readdir = function(dir){
    return new Promise(function(resolve, reject){
        fs.readdir(dir, function(err, files){
            if (err) return reject(err);
            resolve(files);
        });
    });
};


exports.rename = function(oldPath, newPath){
    return new Promise(function(resolve, reject){
        fs.rename(oldPath, newPath, function(err){
            if (err) return reject(err);
            resolve();
        });
    });
};


exports.mkdir = function(dir, o){
    o = o || {};

    return new Promise(function(resolve, reject){
        mkdirp(dir, o, function(err){
            debug(err || 'mkdirp');
            if (err) return reject(err);
            resolve();
        });
    });
};


exports.rmdir = function(dir){
    return new Promise(function(resolve, reject){
        rimraf(dir, function(err){
            debug(err || 'rimraf');
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
            debug(err || 'cpy');
            if (err) return reject(err);
            resolve();
        });
    });
};
