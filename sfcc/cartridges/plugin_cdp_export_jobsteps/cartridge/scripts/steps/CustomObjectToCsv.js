'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileWriter = require('dw/io/FileWriter');
const CSVStreamWriter = require('dw/io/CSVStreamWriter');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');
const Describer = require('../util/Describer');
const CsvUtils = require('../util/CsvUtils');
const FileUtils = require('../util/FileUtils');
const StringUtils = require('../util/StringUtils');
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
    var outputFile = FileUtils.getFilePath(StringUtils.capitalizeFirstLetter(parameters.ObjectName), 'csv');
    var fileWriter = new FileWriter(new File(outputFile));
    var csv = new CSVStreamWriter(fileWriter);

    var describe = Describer.getCustom(parameters.ObjectName);
    csv.writeNext(CsvUtils.buildHeader(describe));

    var customObjects = CustomObjectMgr.getAllCustomObjects(parameters.ObjectName);

    var qol = Delta.customObjectQuery(parameters);
    while(qol.hasNext()) {
        var customObjects = qol.next();
        csv.writeNext(CsvUtils.buildRow(customObjects, describe, parameters));
    };
    qol.close();
    csv.close();
    fileWriter.close();
}

exports.execute = execute;