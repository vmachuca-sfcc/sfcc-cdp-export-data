'use strict';

const Delta = require('./Delta');
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

exports.buildRow = function(object, describer, parameters) {
    var row = [];
    row.push(StringUtils.uuidv4());
    describer.attributeDefinitions.toArray().forEach((def) => {
        const value = def.system
            ? getValue(object, def.ID)
            : getValue(object.custom, def.ID)

        if(Delta.skip(object, parameters)) return;

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

function getValue(object, property) {
    try {
        return object[property];
    } catch (error) {
        return '';
    }
}