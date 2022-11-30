'use strict';

const System = require('dw/system/System');
const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileWriter = require('dw/io/FileWriter');
const CSVStreamWriter = require('dw/io/CSVStreamWriter');
const Order = require('dw/order/Order');
const OrderMgr = require('dw/order/OrderMgr');
const Describer = require('../util/Describer');
const CsvUtils = require('../util/CsvUtils');
const FileUtils = require('../util/FileUtils');
const Delta = require('../util/Delta');

//TODO: Check Query
const query = "exportAfter<{0}";

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
    var outputFile = FileUtils.getFilePath(parameters.FileName, 'csv');
    var fileWriter = new FileWriter(new File(outputFile));
    var csv = new CSVStreamWriter(fileWriter);

    var describe = Describer.getOrder();
    csv.writeNext(CsvUtils.buildHeader(describe));

    var orderIterator = OrderMgr.searchOrders(
        query,
        null,
        System.getCalendar().getTime()
    );

    while(orderIterator.hasNext()) {
        const order = orderIterator.next();
        if(Delta.skip(order, parameters)) continue;
        csv.writeNext(CsvUtils.buildRow(order, describe, parameters));
    }

    csv.close();
    fileWriter.close();
}

exports.execute = execute;