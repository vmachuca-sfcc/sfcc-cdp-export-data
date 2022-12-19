'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const CustomerMgr = require('dw/customer/CustomerMgr');
const Delta = require('../util/Delta');
const CsvType = require('../file/CsvType');
const CsvFile = require('../file/CsvFile');

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
   var csvCustomer = new CsvFile(CsvType.CUSTOMER, params);
   var csvCustomerAddress = new CsvFile(CsvType.CUSTOMER_ADDRESS, params);

    var qol = Delta.systemObjectQuery(CsvType.CUSTOMER.object, params);
    while(qol.hasNext()) {
        var profile = qol.next();
        csvCustomer.addRow(profile);
        profile.getAddressBook().addresses.toArray().forEach(address => {
            csvCustomerAddress.addRow(address);
        });
    };
    csvCustomer.close();
    csvCustomerAddress.close();
}

exports.execute = execute;