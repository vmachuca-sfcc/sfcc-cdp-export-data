'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const FileUtils = require('../util/FileUtils');

function execute(parameters, stepExecution) {
    try {
        //FileUtils.purgeFolder();
        FileUtils.createFolder();
    } catch (error) {
        var err = error;
        Logger.error('An error has occurred: {0}', error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }

    return new Status(Status.OK);
}

exports.execute = execute;