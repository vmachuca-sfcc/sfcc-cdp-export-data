'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const AuthService = require('../service/AuthService');
const CdpService = require('../service/CdpService');
const JobHistory = require('../util/JobHistory');

const JOB_STATUS_FAILED = 'Failed';

function execute(params, stepExecution) {
    try {
        if(params.TurnOff) return new Status(Status.OK);
        monitoring(params);
    } catch (error) {
        Logger.error(error.stack);
        Logger.error(error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function monitoring(params) {
    const credentials = AuthService.getCdpCredentials(params);
    JobHistory.read().forEach(jobId => {
        var state = CdpService.getState(credentials, jobId);
        if(state == JOB_STATUS_FAILED) {
            throw jobId;
        }
    });
}

exports.execute = execute;