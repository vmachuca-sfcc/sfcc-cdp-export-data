'use strict';

const JsonUtils = require('./JsonUtils');
const StringUtils = require('./StringUtils');
const ObjAttrDef = require('dw/object/ObjectAttributeDefinition');

exports.buildHeader = function(describer) {
    var header = [];
    describer.attributeDefinitions.toArray().forEach((def) => {
        header.push(def.ID); //def.displayName
    });
    //return ['UUID'].concat(header);
    return header;
}

exports.buildRow = function(object, describer, parameters) {
    var row = [];
    //row.push(StringUtils.uuidv4());
    describer.attributeDefinitions.toArray().forEach((def) => {
        const value = def.system
            ? getValue(object, def.ID)
            : getValue(object.custom, def.ID)

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

        //check date
        if(
            def.valueTypeCode == ObjAttrDef.VALUE_TYPE_DATE ||
            def.valueTypeCode == ObjAttrDef.VALUE_TYPE_DATETIME
        ) {
            try{
                row.push(String(value));
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
        var noia = value ? StringUtils.fix(value) : 'sss';
        var lol = StringUtils.fix(value);
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