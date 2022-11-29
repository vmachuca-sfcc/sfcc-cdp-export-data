'use strict';

const File = require('dw/io/File');

exports.COMMA_CHAR = ',';

exports.getFilePath = function(name, extension) {
    var folder = File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'CDPDataExported';
    var exportFolder = new File(folder);
    if (!exportFolder.exists()) {
        exportFolder.mkdirs();
    }
    return folder + File.SEPARATOR + name + '.' + extension;
}