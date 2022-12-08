'use strict';

const FileUtils = require('./FileUtils');

exports.isTurnedOff = function(params) {
    try{
        if(!params.TurnOff) return false;
        //FileUtils.remove(params, 'csv');
        return true;
    } catch(error) {
        return false;
    }
}