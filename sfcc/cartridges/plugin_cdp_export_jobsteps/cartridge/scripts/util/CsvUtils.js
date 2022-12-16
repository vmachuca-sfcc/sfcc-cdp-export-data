'use strict';

const JsonUtils = require('./JsonUtils');
const StringUtils = require('./StringUtils');
const ObjAttrDef = require('dw/object/ObjectAttributeDefinition');
const moment = require('moment/moment');

exports.buildHeader = function(describer) {
    var header = [];
    describer.attributeDefinitions.toArray().forEach((def) => {
        header.push(def.ID);
    });
    return header;
}

exports.buildRow = function(object, describer, parameters) {
    var row = [];
    describer.attributeDefinitions.toArray().forEach((def) => {
        const value = def.system
            ? getValue(object, def.ID, def)
            : getValue(object.custom, def.ID, def)
        //check enum
        if(
            def.valueTypeCode == ObjAttrDef.VALUE_TYPE_ENUM_OF_INT ||
            def.valueTypeCode == ObjAttrDef.VALUE_TYPE_ENUM_OF_STRING
        ) {
            try{
                row.push(value.displayName);
                return;
            } catch (error) {
                row.push('');
                return;
            }
        }
        //check non-primitive
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
                row.push('');
                return;
            }
        }
        row.push(value ? StringUtils.fix(value) : '');
    });
    return row;
}

function getValue(object, property, def) {
    try {
        if(
            def != undefined &&
            (def.valueTypeCode == ObjAttrDef.VALUE_TYPE_DATE ||
             def.valueTypeCode == ObjAttrDef.VALUE_TYPE_DATETIME)
        ) {
            return dateFormat(object[property]);
        }
        return object[property];
    } catch (error) {
        return getCustomValue(object, property);
    }
}

function getCustomValue(object, property) {
    try {
        return object.custom[property];
    } catch (error) {
        return '';
    }
}

function getDisplayValue(object, property) {
    try {
        return object[property]['displayValue'];
    } catch (error) {
        return getDisplayName(object, property);
    }
}

function getDisplayName(object, property) {
    try {
        return object[property]['displayName'];
    } catch (error) {
        return getValue(object, property);
    }
}

function dateFormat(value) {
    try{
        return moment(value).format('YYYY-MM-DDTHH:mm:ssZ');
    } catch (error) {
        return '';
    }
}

exports.getValue = getValue;
exports.getCustomValue = getCustomValue;
exports.getDisplayValue = getDisplayValue;
exports.getDisplayName = getDisplayName;