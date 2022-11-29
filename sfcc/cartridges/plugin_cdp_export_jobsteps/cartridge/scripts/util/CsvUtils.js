'use strict';

const JsonUtils = require('./JsonUtils');
const StringUtils = require('./StringUtils');
const ObjAttrDef = require('dw/object/ObjectAttributeDefinition');

exports.buildHeader = function(describer) {
    var header = [];
    describer.attributeDefinitions.toArray().forEach((def) => {
        header.push(def.displayName);
    });
    return ['UUID'].concat(header);
}

exports.buildRow = function(object, describer) {
    var row = [];
    row.push(StringUtils.uuidv4());
    describer.attributeDefinitions.toArray().forEach((def) => {
        const value = def.system
            ? object.hasOwnProperty(def.ID) ? object[def.ID] : ''
            : object.custom.hasOwnProperty(def.ID) ? object.custom[def.ID] : '';

        if(
            !JsonUtils.isPrimitive(value) &&
            def.valueTypeCode != ObjAttrDef.VALUE_TYPE_HTML
        ) {
            try{
                var valueList = [];
                value.forEach((item) => valueList.push(item));
                row.push(value ? valueList.join('|') : '');
                return;
            } catch (error) {
                var err = error;
                return []
            }
        }
        row.push(value ? StringUtils.fix(value) : '');
    });
    return row;
}