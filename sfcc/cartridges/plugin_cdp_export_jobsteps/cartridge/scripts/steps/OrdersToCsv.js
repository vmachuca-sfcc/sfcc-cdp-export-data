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
    "paymentStatus",
    "channelType",
    "totalGrossPrice",
    "totalNetPrice",
    "totalTax",
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
    "confirmationStatus",
    "currencyCode",
    "imported",
    "refundedAmount",
    "orderToken",
    "createdBy",
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

function execute(parameters, stepExecution) {
    try {
        createOutputFile(parameters);
    } catch (error) {
        Logger.error('An error has occurred: {0}', error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createOutputFile(parameters) {
    //vars order
    var fileWriter = new FileWriter(new File(FileUtils.getFilePath(parameters.FileName, 'csv')));
    var csv = new CSVStreamWriter(fileWriter);
    csv.writeNext(orderFields);

    //var order items
    var fileWriterLineItem = new FileWriter(new File(FileUtils.getFilePath(parameters.FileNameOrderItems, 'csv')));
    var csvOrderItems = new CSVStreamWriter(fileWriterLineItem);
    csvOrderItems.writeNext(lineItemsFields);

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
            if(field == 'status' || field == 'paymentStatus' || field == 'channelType') {
                row.push(CsvUtils.getDisplayValue(order, field));
                return;
            }
            row.push(CsvUtils.getValue(order, field));
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
    }

    csv.close();
    csvOrderItems.close();
    fileWriter.close();
    fileWriterLineItem.close();
}

exports.execute = execute;