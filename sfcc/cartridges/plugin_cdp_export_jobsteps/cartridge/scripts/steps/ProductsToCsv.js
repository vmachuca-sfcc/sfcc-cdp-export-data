'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileWriter = require('dw/io/FileWriter');
const CSVStreamWriter = require('dw/io/CSVStreamWriter');
const ProductSearchModel = require('dw/catalog/ProductSearchModel');
const Describer = require('../util/Describer');
const CsvUtils = require('../util/CsvUtils');
const FileUtils = require('../util/FileUtils');

function execute(parameters, stepExecution) {
    try {
        createOutputFile(parameters);
    } catch (error) {
      var err = error;
      Logger.error('An error has occurred: {0}', error.toString());
      return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createOutputFile(parameters) {
    var outputFile = FileUtils.getFilePath(parameters.FileName, 'csv');
    var fileWriter = new FileWriter(new File(outputFile));
    var csv = new CSVStreamWriter(fileWriter);

    var describe = Describer.getProduct();
    csv.writeNext(CsvUtils.buildHeader(describe));

    var psm = new ProductSearchModel();
    psm.setCategoryID('root');
    psm.search();

    var psh = psm.getProductSearchHits();
    var count = 0;
    //while(psh.hasNext() && count < 3) {
    while(psh.hasNext()) {
        var product = psh.next().getProduct();
        csv.writeNext(CsvUtils.buildRow(product, describe, parameters));
    //    count++;
    };
    csv.close();
    fileWriter.close();
}

exports.execute = execute;