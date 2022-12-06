'use strict';

const SystemObjectMgr = require('dw/object/SystemObjectMgr');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');

exports.getProfile = function() {
    return SystemObjectMgr.describe('Profile');
}

exports.getCustomerAddress = function() {
    return SystemObjectMgr.describe('CustomerAddress');
}

exports.getOrder = function() {
    return SystemObjectMgr.describe('Order');
}

exports.getProduct = function() {
    return SystemObjectMgr.describe('Product');
}

exports.getCustom = function(name) {
    return CustomObjectMgr.describe(name);
}

exports.getCustomFieldsName = function(describe) {
    var fields = [];
    describe.attributeDefinitions.toArray().forEach((def) => {
        if(!def.system) fields.push(def.ID);
    });
    return fields;
}