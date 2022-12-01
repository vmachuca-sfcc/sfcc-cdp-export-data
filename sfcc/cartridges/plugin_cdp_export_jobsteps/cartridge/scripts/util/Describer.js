'use strict';

const SystemObjectMgr = require('dw/object/SystemObjectMgr');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');

exports.getProfile = function() {
    return SystemObjectMgr.describe('Profile');
}

exports.getCustomerAddress = function() {
    return SystemObjectMgr.describe('CustomerAddress');
}

exports.getProduct = function() {
    return SystemObjectMgr.describe('Product');
}

exports.getNewsletter = function() {
    return CustomObjectMgr.describe('Newsletter');
}

exports.getBackInStock = function() {
    return CustomObjectMgr.describe('backInStock');
}