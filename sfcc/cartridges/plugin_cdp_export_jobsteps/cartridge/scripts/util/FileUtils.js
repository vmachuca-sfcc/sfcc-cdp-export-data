'use strict';

const File = require('dw/io/File');

const FILE_CUSTOMER_PROFILE = 'CustomerProfile';
const FILE_CUSTOMER_ADDRESS = 'CustomerAddress';
const FILE_PRODUCT          = 'Product';
const FILE_ORDER            = 'Order';
const FILE_ORDER_ITEM       = 'OrderItem';
const FILE_ORDER_SHIPPING   = 'OrderShipping';

function getRootFolder() {
    return File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'cdpIngest';
}

function getFolder() {
    return getRootFolder() + File.SEPARATOR + 'data';
}

exports.createFolder = function() {
    var rootFolder = new File(getRootFolder());
    if(!rootFolder.exists()) rootFolder.mkdir();

    var folder = new File(getFolder());
    if(!folder.exists()) folder.mkdir();
}

exports.purgeFolder = function() {
    try {
        const folder = new File(getFolder());
        if (folder.exists()) folder.remove();
    } catch(error) { }
}

function getFilePath(name, extension) {
    return getFolder() + File.SEPARATOR + name + '.' + extension;
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

exports.getFilePath = getFilePath;
exports.getRootFolder = getRootFolder;

exports.FILE_CUSTOMER_PROFILE = FILE_CUSTOMER_PROFILE;
exports.FILE_CUSTOMER_ADDRESS = FILE_CUSTOMER_ADDRESS;
exports.FILE_PRODUCT          = FILE_PRODUCT;
exports.FILE_ORDER            = FILE_ORDER;
exports.FILE_ORDER_ITEM       = FILE_ORDER_ITEM;
exports.FILE_ORDER_SHIPPING   = FILE_ORDER_SHIPPING;

exports.INGEST_LIST = [
    FILE_CUSTOMER_PROFILE,
    FILE_CUSTOMER_ADDRESS
];

exports.COMMA_CHAR = ',';