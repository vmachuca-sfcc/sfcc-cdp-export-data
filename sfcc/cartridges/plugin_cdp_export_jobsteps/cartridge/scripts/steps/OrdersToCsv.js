'use strict';

const System = require('dw/system/System');
const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileWriter = require('dw/io/FileWriter');
const CSVStreamWriter = require('dw/io/CSVStreamWriter');
const Order = require('dw/order/Order');
const OrderMgr = require('dw/order/OrderMgr');
const CsvUtils = require('../util/CsvUtils');
const FileUtils = require('../util/FileUtils');
const Describer = require('../util/Describer');
const CmpMgr = require('../util/CmpMgr');
const Delta = require('../util/Delta');

//TODO: Check Query
const query = "exportAfter<{0}";

const orderFields = [
    "UUID",
    "orderNo",
    "customerNo",
    "invoiceNo",
    "productQuantityTotal",
    "status",
    "confirmationStatus",
    "paymentStatus",
    "replaceCode",
    "replaceDescription",
    "replacedOrderNo",
    "replacementOrderNo",
    "channelType",
    "totalGrossPrice",
    "totalNetPrice",
    "totalTax",
    "affiliatePartnerID",
    "affiliatePartnerName",
    "businessType",
    "customerEmail",
    "customerLocaleID",
    "customerName",
    "customerOrderReference",
    "exportAfter",
    "exportStatus",
    "externalOrderNo",
    "externalOrderStatus",
    "externalOrderText",
    "adjustedMerchandizeTotalGrossPrice",
    "adjustedMerchandizeTotalNetPrice",
    "adjustedMerchandizeTotalPrice",
    "adjustedMerchandizeTotalTax",
    "adjustedShippingTotalGrossPrice",
    "adjustedShippingTotalNetPrice",
    "adjustedShippingTotalPrice",
    "adjustedShippingTotalTax",
    "merchandizeTotalGrossPrice",
    "merchandizeTotalNetPrice",
    "merchandizeTotalPrice",
    "merchandizeTotalTax",
    "cancelCode",
    "cancelDescription",
    "currencyCode",
    "imported",
    "refundedAmount",
    "orderToken",
    "createdBy",
    "creationDate",
    "lastModified"
];

const lineItemsFields = [
    "UUID",
    "orderNo",
    "productID",
    "productName",
    "quantityValue",
    "adjustedGrossPrice",
    "adjustedNetPrice",
    "adjustedGrossPrice",
    "adjustedTax",
    "basePrice",
    "grossPrice",
    "netPrice",
    "priceValue",
    "gift",
    "giftMessage",
    "tax",
    "taxBasis",
    "taxClassID",
    "taxRate",
    "lastModified"
];

const shippingFields = [
    "UUID",
    "orderNo",
    "shipmentNo",
    "shippingMethod",
    "shippingMethodID",
    "shippingStatus",
    "totalGrossPrice",
    "totalNetPrice",
    "totalTax",
    "trackingNumber",
    "creationDate",
    "lastModified"
];

const shippingAddressFields = [
    "address1",
    "address2",
    "city",
    "stateCode",
    "countryCode",
    "postalCode"
];

function execute(parameters, stepExecution) {
    try {
        if(CmpMgr.isTurnedOff(parameters)) return new Status(Status.OK);
        createOutputFile(parameters);
    } catch (error) {
        Logger.error('An error has occurred: {0}', error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createOutputFile(parameters) {
    //var order
    var fileWriter = new FileWriter(new File(FileUtils.getFilePath(FileUtils.FILE_ORDER, 'csv')));
    var csv = new CSVStreamWriter(fileWriter);
    var customFields = Describer.getCustomFieldsName(Describer.getOrder());
    csv.writeNext(orderFields.concat(customFields));

    //var order items
    var fileWriterLineItem = new FileWriter(new File(FileUtils.getFilePath(FileUtils.FILE_ORDER_ITEM, 'csv')));
    var csvOrderItems = new CSVStreamWriter(fileWriterLineItem);
    csvOrderItems.writeNext(lineItemsFields);

    //var shipping order
    var fileWriterShipping = new FileWriter(new File(FileUtils.getFilePath(FileUtils.FILE_ORDER_SHIPPING, 'csv')));
    var csvShipping = new CSVStreamWriter(fileWriterShipping);
    csvShipping.writeNext(shippingFields.concat(shippingAddressFields));

    //query
    var orderIterator = OrderMgr.searchOrders(
        query,
        null,
        System.getCalendar().getTime()
    );

    while(orderIterator.hasNext()) {
        var order = orderIterator.next();
        //if(Delta.skip(order, parameters)) continue;

        //order
        var row = [];
        orderFields.forEach(field => {
            if(field == 'status' || field == 'paymentStatus' ||
                field == 'channelType' || field == 'confirmationStatus') {
                row.push(CsvUtils.getDisplayValue(order, field));
                return;
            }
            row.push(CsvUtils.getValue(order, field));
        });
        customFields.forEach(field => {
            row.push(CsvUtils.getCustomValue(order, field));
        });
        csv.writeNext(row);

        //order items
        order.allProductLineItems.toArray().forEach(item => {
            var row = [];
            lineItemsFields.forEach(field => {
                if(field == 'orderNo') {
                    row.push(order.orderNo);
                    return;
                }
                row.push(CsvUtils.getValue(item, field));
            });
            csvOrderItems.writeNext(row);
        });

        //shipping order
        order.shipments.toArray().forEach(item => {
            var row = [];
            shippingFields.forEach(field => {
                if(field == 'orderNo') {
                    row.push(order.orderNo);
                    return;
                }
                if(field == 'shippingMethod' || field == 'shippingStatus' || field == 'businessType' ||
                   field == 'exportStatus' || field == 'replaceCode') {
                    row.push(CsvUtils.getDisplayName(item, field));
                    return;
                }
                row.push(CsvUtils.getValue(item, field));
            });
            shippingAddressFields.forEach(field => {
                row.push(CsvUtils.getValue(item.shippingAddress, field));
            });
            csvShipping.writeNext(row);
        });
    }

    csv.close();
    csvOrderItems.close();
    csvShipping.close();
    fileWriter.close();
    fileWriterLineItem.close();
    fileWriterShipping.close();
}

exports.execute = execute;