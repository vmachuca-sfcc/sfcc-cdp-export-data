'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const CustomerMgr = require('dw/customer/CustomerMgr');
const CustomerMap = require('../map/CustomerMap');
const Delta = require('../util/Delta');
const CsvType = require('../file/CsvType');
const CsvFile = require('../file/CsvFile');

const FIELD_CUSTOMER_NO = 'customerNo';

function execute(params, stepExecution) {
    try {
        if(params.SkipData) return new Status(Status.OK);
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
    var csvCustomerAddress = new CsvFile(CsvType.CUSTOMER_ADDRESS, params, true);

    csvCustomerAddress.addRowFromList(CustomerMap.addressFields);

    var qol = Delta.systemObjectQuery(CsvType.CUSTOMER.object, params);
    while(qol.hasNext()) {
        // profile
        var profile = qol.next();
        csvCustomer.addRow(profile);

        //address
        profile.getAddressBook().addresses.toArray().forEach(address => {
            var row = [];
            CustomerMap.addressFields.forEach(field => {
                if(field == FIELD_CUSTOMER_NO) {
                    row.push(profile[FIELD_CUSTOMER_NO]);
                    return;
                }
                row.push(address[field]);
            });
            csvCustomerAddress.addRowFromList(row);
        });
    };
    csvCustomer.close();
    csvCustomerAddress.close();
}

exports.execute = execute;