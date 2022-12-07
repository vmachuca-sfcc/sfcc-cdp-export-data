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

const TOTAL_LINES_BATCH = 500;

function execute(parameters, stepExecution) {
    try {
        if(CmpMgr.isTurnedOff(parameters)) return new Status(Status.OK);
        createBulkIngest(parameters);
    } catch (error) {
        var err = error;
        Logger.error('An error has occurred: {0}', error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createBulkIngest(parameters) {
    const credentials = AuthService.getCdpCredentials(parameters);
    cleanUpJobs(credentials);

    const itemsToBeIngested = FileUtils.getIngestList(parameters);

    itemsToBeIngested.forEach(item => {
        const jobDetails = CdpService.createJob(credentials, item, parameters.CdpSource);
        JobHistory.write(jobDetails.object.id);

        var count = 0;
		var line = '';
        var lines = '';
        var header = '';
        var fr = new FileReader(new File(FileUtils.getFilePath(item, 'csv')));
		do {
            count++;
			line = fr.readLine();
            if(count == 1) {
                header = line;
                continue;
            }
            lines += line + '\n';
            if(count != TOTAL_LINES_BATCH) continue;
            sendBatch(credentials, jobDetails, header, lines);
            lines = '';
		} while (line != null);
        fr.close();

        if(lines) {
            uploadBatch(credentials, jobDetails, header, lines);
        }
        CdpService.uploadComplete(credentials, jobDetails.object.id);
    });
}

function uploadBatch(credentials, jobDetails, header, lines) {
    var batch = header + '\n' + lines
    const accept = CdpService.ingest(credentials, jobDetails.object, batch);
    return accept;
}

function cleanUpJobs(credentials) {
    JobHistory.read().forEach(jobId => {
        CdpService.cleanUp(credentials, jobId);
    });
}

exports.execute = execute;