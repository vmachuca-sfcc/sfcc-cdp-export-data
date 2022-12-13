'use strict';

const OrderMgr = require('dw/order/OrderMgr');
const SystemObjectMgr = require('dw/object/SystemObjectMgr');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');
const moment = require('moment/moment');

function getStartDate() {
    return moment().startOf("day").subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
}

function getEndDate() {
    return moment().endOf("day").subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
}

exports.isPartOf = function(object, params) {
    try{
        // if delta is false all items will part of
        if(!params.Delta) return true;
        const lastModified = object['lastModified'];
        // if the value is null or empty the item will be skipped
        if(!lastModified) return false;
        const yesterday =  moment().subtract(1, 'days');
        return moment(lastModified).isSame(yesterday, 'day');
    } catch(error) {
        return false;
    }
}

exports.systemObjectQuery = function(objectName, params) {
    if(!params.Delta) return SystemObjectMgr.getAllSystemObjects(objectName);
    return SystemObjectMgr.querySystemObjects(
        objectName,
        'lastModified >= {0} AND lastModified <= {1}',
        'lastModified ASC',
        getStartDate(),
        getEndDate()
    );
}

exports.customObjectQuery = function(params) {
    if(!params.Delta) return CustomObjectMgr.getAllCustomObjects(params.ObjectName);
    return CustomObjectMgr.queryCustomObjects(
        params.ObjectName,
        'lastModified >= {0} AND lastModified <= {1}',
        'lastModified ASC',
        getStartDate(),
        getEndDate()
    );
}

exports.orderQuery = function(params) {
    if(!params.Delta) {
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