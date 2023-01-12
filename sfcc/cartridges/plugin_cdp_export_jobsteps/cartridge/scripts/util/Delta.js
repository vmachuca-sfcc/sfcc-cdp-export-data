'use strict';

const OrderMgr = require('dw/order/OrderMgr');
const SystemObjectMgr = require('dw/object/SystemObjectMgr');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');
const moment = require('moment/moment');
const JobHistory = require('./JobHistory');

function hasHistory() {
    return JobHistory.getLastExecution() != null;
}

function getStartDate() {
    var lol = moment(JobHistory.getLastExecution());
    return moment(JobHistory.getLastExecution()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
}

function getEndDate() {
    return moment().endOf("day").format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
}

exports.isPartOf = function(object, params) {
    try{
        // if ForceFullData is true or theres not history all items will part of
        if(params.ForceFullData || !hasHistory()) return true;

        // if the value is null or empty the item will be skipped
        const lastModified = object['lastModified'];
        if(!lastModified) return false;

        // if the lastModified is the same of after the lastExecution of the job
        const lastExecution = moment(JobHistory.getLastExecution());
        return moment(lastModified).isSameOrAfter(lastExecution);
    } catch(error) {
        return false;
    }
}

exports.systemObjectQuery = function(objectName, params) {
    if(params.ForceFullData || !hasHistory())
        return SystemObjectMgr.getAllSystemObjects(objectName);

    return SystemObjectMgr.querySystemObjects(
        objectName,
        'lastModified >= {0} AND lastModified <= {1}',
        'lastModified ASC',
        getStartDate(),
        getEndDate()
    );
}

exports.customObjectQuery = function(params, objectName) {
    var objName = objectName != undefined ? objectName : params.ObjectName;

    if(params.ForceFullData || !hasHistory())
        return CustomObjectMgr.getAllCustomObjects(objName);

    return CustomObjectMgr.queryCustomObjects(
        objName,
        'lastModified >= {0} AND lastModified <= {1}',
        'lastModified ASC',
        getStartDate(),
        getEndDate()
    );
}

exports.orderQuery = function(params) {
    if(params.ForceFullData || !hasHistory()) {
        return OrderMgr.searchOrders(
            '',
            'lastModified ASC',
        );
    }
    return OrderMgr.searchOrders(
        'lastModified >= {0} AND lastModified <= {1}',
        'lastModified ASC',
        getStartDate(),
        getEndDate()
    );
}