'use strict';

const System = require('dw/system/System');
const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const Order = require('dw/order/Order');
const OrderMgr = require('dw/order/OrderMgr');
const Delta = require('../util/Delta');
const OrderMap = require('../map/OrderMap');
const Describer = require('../util/Describer');
const CsvUtils = require('../util/CsvUtils');
const CsvType = require('../file/CsvType');
const CsvFile = require('../file/CsvFile');

const FIELD_ORDER_NO       = 'orderNo';
const FIELD_CUSTOMER_NO    = 'customerNo';
const FIELD_STATUS         = 'status';
const FIELD_PAYMENT_STATUS = 'paymentStatus';
const FIELD_CHANNEL_TYPE   = 'channelType';
const FIELD_CONF_STATUS    = 'confirmationStatus';

function execute(params, stepExecution) {
    try {
        if(params.TurnOff) return new Status(Status.OK);
        createOutputFile(params);
    } catch (error) {
        Logger.error(error.stack);
        Logger.error(error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createOutputFile(params) {
    var csvOrder = new CsvFile(CsvType.ORDER, params, true);
    var csvOrderItem = new CsvFile(CsvType.ORDER_ITEM, params, true);
    var csvOrderCoupon = new CsvFile(CsvType.ORDER_COUPON, params, true);

    var customFields = Describer.getCustomFieldsName(csvOrder.describe);
    csvOrder.addRowFromList(OrderMap.orderFields.concat(customFields));
    csvOrderItem.addRowFromList(OrderMap.lineItemsFields);
    csvOrderCoupon.addRowFromList(OrderMap.couponFields);

    var oql = Delta.orderQuery(params);
    while(oql.hasNext()) {
        var order = oql.next();
        //order
        var row = [];
        OrderMap.orderFields.forEach(field => {
            if(
                field == FIELD_STATUS ||
                field == FIELD_PAYMENT_STATUS||
                field == FIELD_CHANNEL_TYPE ||
                field == FIELD_CONF_STATUS
            ) {
                row.push(CsvUtils.getDisplayValue(order, field));
                return;
            }
            row.push(CsvUtils.getValue(order, field));
        });
        customFields.forEach(field => {
            row.push(CsvUtils.getCustomValue(order, field));
        });
        csvOrder.addRowFromList(row);

        //order-item
        order.allProductLineItems.toArray().forEach(item => {
            var row = [];
            OrderMap.lineItemsFields.forEach(field => {
                if(field == FIELD_ORDER_NO) {
                    row.push(order.orderNo);
                    return;
                }
                var def = Describer.getByName(csvOrder.describe, field);
                row.push(CsvUtils.getValue(item, field, def));
            });
            csvOrderItem.addRowFromList(row);
        });

        //order-coupon
        order.couponLineItems.toArray().forEach(item => {
            var row = [];
            OrderMap.couponFields.forEach(field => {
                if(field == FIELD_ORDER_NO) {
                    row.push(order.orderNo);
                    return;
                }
                if(field == FIELD_CUSTOMER_NO) {
                    row.push(order.customerNo);
                    return;
                }
                var def = Describer.getByName(csvOrder.describe, field);
                row.push(CsvUtils.getValue(item, field, def));
            });
            csvOrderCoupon.addRowFromList(row);
        });
    }
    csvOrder.close();
    csvOrderItem.close();
    csvOrderCoupon.close();
}

exports.execute = execute;