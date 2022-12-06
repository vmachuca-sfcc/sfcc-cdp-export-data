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

function execute(parameters, stepExecution) {
    try {
        if(CmpMgr.isTurnedOff(parameters)) return new Status(Status.OK);
        createBulkInjestion(parameters);
    } catch (error) {
        var err = error;
        Logger.error('An error has occurred: {0}', error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createBulkInjestion(parameters) {
    const credentials = AuthService.getCdpCredentials(parameters);
    cleanUpJobs(credentials);

    const items = FileUtils.INGEST_LIST;
    items.forEach(item => {
        const jobDetails = CdpService.createJob(credentials, item, parameters.CdpSource);
        if(jobDetails.status == 'ERROR') {
            throw 'Conflit to create job:' + item;
        }
        JobHistory.write(jobDetails.object.id);
        const fr = new FileReader(new File(FileUtils.getFilePath(item, 'csv')));
        const accept = CdpService.ingest(credentials, jobDetails.object, fr.readString());
        fr.close();
    });
}

function cleanUpJobs(credentials) {
    JobHistory.read().forEach(jobId => {
        CdpService.cleanUp(credentials, jobId);
    });
}

exports.execute = execute;