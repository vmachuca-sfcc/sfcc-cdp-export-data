'use strict';

const File = require('dw/io/File');
const FileWriter = require('dw/io/FileWriter');
const CSVStreamWriter = require('dw/io/CSVStreamWriter');
const Describer = require('../util/Describer');
const CsvUtils = require('../util/CsvUtils');
const FileUtils = require('../util/FileUtils');
const MapMgr = require('../map/MapMgr');

function CsvFile(fileType, params, skipHeader) {
    this.params = params;
    this.describe = Describer.get(fileType.object);
    this.outputFile = FileUtils.getFilePath(fileType.file, 'csv');
    this.fileWriter = new FileWriter(new File(this.outputFile));
    this.csv = new CSVStreamWriter(this.fileWriter);
    if(this.describe && skipHeader == undefined)
        this.csv.writeNext(MapMgr.substitute(CsvUtils.buildHeader(this.describe), params));
}

CsvFile.prototype.addRow = function(item) {
    this.csv.writeNext(CsvUtils.buildRow(item, this.describe, this.params));
};

CsvFile.prototype.addRowFromList = function(items) {
    this.csv.writeNext(items);
};

CsvFile.prototype.close = function() {
    this.csv.close();
    this.fileWriter.close();
};

module.exports = CsvFile;