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

exports.getOrder = function() {
    return SystemObjectMgr.describe('Order');
}

exports.getProductLineItem = function() {
    return SystemObjectMgr.describe('ProductLineItem');
}

exports.getShippingOrderItem = function() {
    return SystemObjectMgr.describe('ShippingOrderItem');
}