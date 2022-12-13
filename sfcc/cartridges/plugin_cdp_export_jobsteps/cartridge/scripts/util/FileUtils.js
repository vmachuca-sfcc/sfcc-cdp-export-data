'use strict';

const File = require('dw/io/File');
const CsvType = require('../file/CsvType');

function getRootFolder() {
    return File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'cdpWorkspace';
}

function getFolder() {
    return getRootFolder() + File.SEPARATOR + 'data';
}

function createFolder() {
    var rootFolder = new File(getRootFolder());
    if(!rootFolder.exists()) rootFolder.mkdir();

    var folder = new File(getFolder());
    if(!folder.exists()) folder.mkdir();
}

function purgeFolder() {
    try {
        const folder = new File(getFolder());
        if(!folder.exists()) return;
        folder.listFiles().toArray().forEach(item => {
            new File(item.fullPath).remove();
        });
        folder.remove();
    } catch(error) { }
}

function getFilePath(name, extension) {
    return getFolder() + File.SEPARATOR + name + '.' + extension;
}

exports.resetWorkspace = function() {
    purgeFolder();
    createFolder();
}

exports.getRootFilePath = function(name, extension) {
    const folder = File.IMPEX + File.SEPARATOR + 'src';
    return folder + File.SEPARATOR + name + '.' + extension;
}

exports.remove = function(params, extension) {
    try {
        var file = new File(getFilePath(params.FileName, extension));
        if(!file.exists()) return;
        file.remove();
    } catch(error) { }
}

exports.getIngestList = function(params) {
    return CsvType.SYSTEM_INGEST_LIST.concat(params.CustomObjects.split(','))
}

exports.getFilePath = getFilePath;
exports.getRootFolder = getRootFolder;