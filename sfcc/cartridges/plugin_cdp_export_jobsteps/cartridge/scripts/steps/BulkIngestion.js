'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const AuthService = require('../service/AuthService');
const CdpService = require('../service/CdpService');
const FileUtils = require('../util/FileUtils');
const JobHistory = require('../util/JobHistory');

function execute(params, stepExecution) {
    try {
        if(params.TurnOff) return new Status(Status.OK);
        createBulkIngestion(params);
    } catch (error) {
        var err = error;
        Logger.error(error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}
function createBulkIngestion(params) {
    const credentials = AuthService.getCdpCredentials(params);
    cleanUpJobs(credentials);

    FileUtils.getIngestList(params).forEach(item => {
        var file = new File(FileUtils.getFilePath(item, 'csv'));
        if(!file.exists()) return;

        const jobDetails = CdpService.createJob(credentials, item, params.CdpSource);
        JobHistory.write(jobDetails.id);

		CdpService.ingest(credentials, jobDetails, file);
        CdpService.uploadComplete(credentials, jobDetails.id);
    });
}

function cleanUpJobs(credentials) {
    CdpService.cleanUpAll(credentials);
    /*
    JobHistory.read().forEach(jobId => {
        CdpService.cleanUp(credentials, jobId);
    });
    */
    JobHistory.purge();
}

exports.execute = execute;