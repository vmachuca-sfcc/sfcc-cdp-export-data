'use strict';

function getcdp(field, map) {
    var value = null;
    map.forEach(item => {
        if(item.b2c == field)
            value = item.cdp;
    });
    return value;
}

exports.substitute = function(headers, params) {
    if(!params.hasOwnProperty('FieldMap')) return headers;
    var lol = params.FieldMap;
    var fieldsData = JSON.parse(params.FieldMap);
    var items = [];
    var map = fieldsData ? fieldsData.fields : [];
    headers.forEach(field => {
        var value = getcdp(field, map);
        items.push(value == null ? field : value);
    });
    return items;
}