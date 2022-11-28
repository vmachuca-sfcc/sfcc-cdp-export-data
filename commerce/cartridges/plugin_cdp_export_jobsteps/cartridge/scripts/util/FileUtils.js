'use strict';

const File = require('dw/io/File');

exports.COMMA_CHAR = ',';

exports.getFilePath = function(name, extension) {
    return File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + name + '.' + extension;
}