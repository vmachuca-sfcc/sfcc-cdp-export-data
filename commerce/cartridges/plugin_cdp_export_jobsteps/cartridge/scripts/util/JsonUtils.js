'use strict';

exports.getAttributeValue = function(obj, field) {
    return obj.hasOwnProperty(field) ? obj[field] : '';
}

exports.getCustomAttributeValue = function(obj, field) {
    var value = '';
    obj['custom-attributes']['custom-attribute'].forEach((attr) => {
        if(attr['attribute-id']['@_attribute-id'] != field) return;
        value = attr['#text'];
    });
    return value;
}