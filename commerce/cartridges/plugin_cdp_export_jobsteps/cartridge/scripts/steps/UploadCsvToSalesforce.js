'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileReader = require('dw/io/FileReader');
const SalesforceService = require('../service/SalesforceService');
const FileUtils = require('../util/FileUtils');

function execute(parameters, stepExecution) {
    try {
        uploadCsvFileToSalesforce(parameters);
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