'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const AuthService = require('../service/AuthService');
const CdpService = require('../service/CdpService');
const JobHistory = require('../util/JobHistory');
const CmpMgr = require('../util/CmpMgr');

const JOB_STATUS_FAILED = 'Failed';

function execute(parameters, stepExecution) {
    try {
        if(CmpMgr.isTurnedOff(parameters)) return new Status(Status.OK);
        monitoring(parameters);
    } catch (error) {
        Logger.error('CDP Job failed: ', error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function monitoring(parameters) {
    const credentials = AuthService.getCdpCredentials(parameters);
    JobHistory.read().forEach(jobId => {
        var state = CdpService.getState(credentials, jobId);
        if(state == JOB_STATUS_FAILED) {
            throw jobId;
        }
    });
}

exports.execute = execute;