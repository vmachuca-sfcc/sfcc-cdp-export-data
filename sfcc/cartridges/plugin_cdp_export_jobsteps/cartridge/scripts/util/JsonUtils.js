'use strict';

exports.getAttributeValue = function(obj, field) {
    return obj.hasOwnProperty(field) ? obj[field] : '';
}

exports.getCustomAttributeValue = function(obj, field) {
    var value = '';
    try {
        var items = [];
        if(obj['custom-attributes']['custom-attribute'].hasOwnProperty('attribute-id')) {
            items.push(obj['custom-attributes']['custom-attribute']);
        } else {
            obj['custom-attributes']['custom-attribute'].forEach(a => items.push(a));
        }
        items.forEach((attr) => {
            if(attr['attribute-id']['@_attribute-id'] != field) return;
            value = attr['#text'];
        });
        return value;
    } catch(error) {
        return value;
    }
}

exports.isPrimitive = function(value) {
    return value !== Object(value) && typeof value != "function";
}

exports.removeItem = function(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}


