'use strict';
/**
 * THIS IS A CUSTOM JOB STEP TO A SPECIFIC PROJECT, PLEASE IGNORE OR DISCARD IT
 */
const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const StringUtils = require('../util/StringUtils');
const CsvUtils = require('../util/CsvUtils');
const Describer = require('../util/Describer');
const Delta = require('../util/Delta');
const CsvFile = require('../file/CsvFile');

const fieldMap = [
    'UUID',
    'productId',
    'nome',
    'email',
    'creationDate',
    'lastModified'
];

function execute(params, stepExecution) {
    try {
        if(params.TurnOff) return new Status(Status.OK);
        createOutputFile(params);
    } catch (error) {
        Logger.error(error.stack);
        Logger.error(error.toString());
        return new Status(Status.ERROR, 'ERROR', error.stack);
    }
    return new Status(Status.OK);
}

function createOutputFile(params) {
    var csv = new CsvFile(
        {
            file: 'BackInStock',
            object: 'backInStock'
        },
        params,
        true
    );
    csv.addRowFromList(fieldMap);
    var qol = Delta.customObjectQuery(params, 'backInStock');
    while(qol.hasNext()) {
        var obj = qol.next();
        var row = [];
        var cds = CsvUtils.getCustomValue(obj, 'customerData');
        if(cds) {
            cds.forEach(cd => {
                row = [];
                var data = JSON.parse(cd);
                fieldMap.forEach(field => {
                    if(field == 'nome' || field == 'email') {
                        row.push(data && data.hasOwnProperty(field) ? data[field] : '');
                        return;
                    }
                    var def = Describer.getByName(csv.describe, field);
                    row.push(CsvUtils.getValue(obj, field, def));
                });
                csv.addRowFromList(row);
            });
            continue;
        }
        fieldMap.forEach(field => {
            if(field == 'nome' || field == 'email') {
                row.push('');
                return;
            }
            var def = Describer.getByName(csv.describe, field);
            row.push(CsvUtils.getValue(obj, field, def));
        });
        csv.addRowFromList(row);
    };
    csv.close();
 }

exports.execute = execute;