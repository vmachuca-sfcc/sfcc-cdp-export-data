'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileWriter = require('dw/io/FileWriter');
const CSVStreamWriter = require('dw/io/CSVStreamWriter');
const CustomerMgr = require('dw/customer/CustomerMgr');
const Describer = require('../util/Describer');
const CsvUtils = require('../util/CsvUtils');
const FileUtils = require('../util/FileUtils');
const Delta = require('../util/Delta');
const CmpMgr = require('../util/CmpMgr');



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
    var outputFile = FileUtils.getFilePath(FileUtils.FILE_CUSTOMER_PROFILE, 'csv');
    var fileWriter = new FileWriter(new File(outputFile));
    var csv = new CSVStreamWriter(fileWriter);

    var describe = Describer.getProfile();
    csv.writeNext(CsvUtils.buildHeader(describe));

    var outputFile2 = FileUtils.getFilePath(FileUtils.FILE_CUSTOMER_ADDRESS, 'csv');
    var fileWriter2 = new FileWriter(new File(outputFile2), 'UTF-8');
    var csv2 = new CSVStreamWriter(fileWriter2);

    var describeAddress = Describer.getCustomerAddress();
    csv2.writeNext(CsvUtils.buildHeader(describeAddress));

    var qol = Delta.systemObjectQuery('Profile', parameters);
    while(qol.hasNext()) {
        var profile = qol.next();
        csv.writeNext(CsvUtils.buildRow(profile, describe, parameters));
        var addresses = profile.getAddressBook().addresses;
        addresses.toArray().forEach(address => {
            csv2.writeNext(CsvUtils.buildRow(address, describeAddress, parameters));
        });
    };
    csv.close();
    csv2.close();
    fileWriter.close();
    fileWriter2.close();
}

exports.execute = execute;