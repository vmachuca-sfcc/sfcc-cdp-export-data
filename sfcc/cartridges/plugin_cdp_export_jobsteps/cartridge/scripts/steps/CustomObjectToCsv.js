'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const StringUtils = require('../util/StringUtils');
const Delta = require('../util/Delta');
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
    var csv = new CsvFile(
        {
            file: StringUtils.capFirstLetter(params.ObjectName),
            object: params.ObjectName
        },
        params
    );
     var qol = Delta.customObjectQuery(params);
     while(qol.hasNext()) {
        var customObject = qol.next();
        csv.addRow(customObject);
     };
     csv.close();
 }

exports.execute = execute;