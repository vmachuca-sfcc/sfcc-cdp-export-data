'use strict';

const SystemObjectMgr = require('dw/object/SystemObjectMgr');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');

exports.get = function(name) {
    try {
        var desc = SystemObjectMgr.describe(name);
        return desc != null ? desc : CustomObjectMgr.describe(name);
    } catch(error) {
        return null;
    }
}

exports.getCustomFieldsName = function(describe) {
    var fields = [];
    describe.attributeDefinitions.toArray().forEach((def) => {
        if(!def.system) fields.push(def.ID);
    });
    return fields;
}

exports.getByName = function(describe, field) {
    var result = undefined;
    describe.attributeDefinitions.toArray().forEach((def) => {
        if(def.ID == field) result = def;
    });
    return result;
}