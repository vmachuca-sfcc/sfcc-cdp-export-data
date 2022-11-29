'use strict';

const moment = require('moment/moment');

exports.skip = function(object, params) {
    try{
        if(params.FullLoad) return false;
        const lastModified = object['lastModified'];
        const yesterday =  moment().subtract(1, 'days');
        return moment(lastModified).isAfter(yesterday);
    } catch(error) {
        return false;
    }
}