'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileReader = require('dw/io/FileReader');
const AuthService = require('../service/AuthService');
const CdpService = require('../service/CdpService');
const FileUtils = require('../util/FileUtils');
const JobHistory = require('../util/JobHistory');
const CmpMgr = require('../util/CmpMgr');

const TOTAL_LINES_BATCH = 300;

function execute(parameters, stepExecution) {
    try {
        if(CmpMgr.isTurnedOff(parameters)) return new Status(Status.OK);
        createBulkIngest(parameters);
    } catch (error) {
        Logger.error('An error has occurred: {0}', error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createBulkIngest(parameters) {
    const credentials = AuthService.getCdpCredentials(parameters);
    cleanUpJobs(credentials);

    FileUtils.getIngestList(parameters).forEach(item => {
        const jobDetails = CdpService.createJob(credentials, item, parameters.CdpSource);
        JobHistory.write(jobDetails.object.id);

        var file = new File(FileUtils.getFilePath(item, 'csv'));
		CdpService.ingest(credentials, jobDetails.object, file);
        CdpService.uploadComplete(credentials, jobDetails.object.id);
    });
}

function cleanUpJobs(credentials) {
    JobHistory.read().forEach(jobId => {
        CdpService.cleanUp(credentials, jobId);
    });
    //JobHistory.purge();
}

exports.execute = execute;