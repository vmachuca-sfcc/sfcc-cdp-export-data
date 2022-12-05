'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileReader = require('dw/io/FileReader');
const SalesforceService = require('../service/SalesforceService');
const FileUtils = require('../util/FileUtils');
const CmpMgr = require('../util/CmpMgr');

function execute(parameters, stepExecution) {
    try {
        if(CmpMgr.isTurnedOff(parameters)) return new Status(Status.OK);
        //uploadCsvFileToSalesforce(parameters);
    } catch (error) {
      Logger.error('An error has occurred: {0}', error.toString());
      return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function uploadCsvFileToSalesforce(parameters) {
    var path = FileUtils.getFilePath(parameters.FileName, 'csv');
    var fr = new FileReader(new File(path));
    SalesforceService.uploadCsvFile(parameters, fr);
    fr.close();
}

exports.execute = execute;