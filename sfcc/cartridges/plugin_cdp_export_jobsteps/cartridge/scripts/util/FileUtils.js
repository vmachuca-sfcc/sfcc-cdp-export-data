'use strict';

const File = require('dw/io/File');

exports.COMMA_CHAR = ',';

exports.getRootFilePath = function(name, extension) {
    const folder = File.IMPEX + File.SEPARATOR + 'src';
    return folder + File.SEPARATOR + name + '.' + extension;
}

exports.getFilePath = function(name, extension) {
    const folder = File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'CDPDataExported';
    const exportFolder = new File(folder);
    if (!exportFolder.exists()) {
        exportFolder.mkdirs();
    }
    return folder + File.SEPARATOR + name + '.' + extension;
}