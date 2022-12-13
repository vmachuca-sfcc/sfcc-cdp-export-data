'use strict';

const File = require('dw/io/File');

const FILE_CUSTOMER_PROFILE    = 'CustomerProfile';
const FILE_CUSTOMER_ADDRESS    = 'CustomerAddress';
const FILE_PRODUCT             = 'Product';
const FILE_PRODUCT_PRICE_MODEL = 'ProductPriceModel';
const FILE_ORDER               = 'Order';
const FILE_ORDER_ITEM          = 'OrderItem';
const FILE_ORDER_SHIPPING      = 'OrderShipping';

const SYSTEM_INGEST_LIST = [
    FILE_CUSTOMER_PROFILE,
    FILE_CUSTOMER_ADDRESS,
    FILE_PRODUCT,
    FILE_ORDER,
    FILE_ORDER_ITEM
];

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

function purgeFolder () {
    try {
        const folder = new File(getFolder());
        if (folder.exists()) folder.remove();
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
    return SYSTEM_INGEST_LIST.concat(params.CustomObjects.split(','))
}

exports.getFilePath = getFilePath;
exports.getRootFolder = getRootFolder;

exports.FILE_CUSTOMER_PROFILE    = FILE_CUSTOMER_PROFILE;
exports.FILE_CUSTOMER_ADDRESS    = FILE_CUSTOMER_ADDRESS;
exports.FILE_PRODUCT             = FILE_PRODUCT;
exports.FILE_PRODUCT_PRICE_MODEL = FILE_PRODUCT_PRICE_MODEL;
exports.FILE_ORDER               = FILE_ORDER;
exports.FILE_ORDER_ITEM          = FILE_ORDER_ITEM;
exports.FILE_ORDER_SHIPPING      = FILE_ORDER_SHIPPING;

exports.COMMA_CHAR = ',';