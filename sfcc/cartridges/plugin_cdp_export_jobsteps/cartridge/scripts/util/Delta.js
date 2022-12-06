'use strict';

const moment = require('moment/moment');

exports.isPartOf = function(object, params) {
    try{
        // if delta is false all items will part of
        if(!params.Delta) return true;
        const data = object['lastModified'];
        // if the value is null or empty the item will be skipped
        if(!data) return false;
        const yesterday =  moment().subtract(1, 'days');
        const lastModified = moment();
        return lastModified.isSame(yesterday, 'day');
    } catch(error) {
        return false;
    }
}
