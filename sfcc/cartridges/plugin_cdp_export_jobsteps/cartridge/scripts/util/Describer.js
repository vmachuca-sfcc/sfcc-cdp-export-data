'use strict';

const SystemObjectMgr = require('dw/object/SystemObjectMgr');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');

exports.getProduct = function() {
    return SystemObjectMgr.describe('Product');
}