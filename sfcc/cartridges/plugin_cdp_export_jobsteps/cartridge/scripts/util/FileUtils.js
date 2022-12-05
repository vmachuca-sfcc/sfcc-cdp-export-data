'use strict';

const File = require('dw/io/File');

exports.COMMA_CHAR = ',';

exports.getRootFilePath = function(name, extension) {
    const folder = File.IMPEX + File.SEPARATOR + 'src';
    return folder + File.SEPARATOR + name + '.' + extension;
}

function getFilePath(name, extension) {
    const folder = File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'cdpExported';
    const exportFolder = new File(folder);
    if (!exportFolder.exists()) {
        exportFolder.mkdirs();
    }
    return folder + File.SEPARATOR + name + '.' + extension;
}

exports.remove = function(params, extension) {
    try {
        var file = new File(getFilePath(params.FileName, extension));
        if(!file.exists()) return;
        file.remove();
    } catch(error) { }
}

exports.getFilePath = getFilePath;