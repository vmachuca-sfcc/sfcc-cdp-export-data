'use strict';

const HTTPClient = require('dw/net/HTTPClient');
const CsvType = require('../file/CsvType');

exports.createJob = function(credentials, object, source) {
    var client = new HTTPClient();
    client.open('POST', 'https://' + credentials.instance_url + '/api/v1/ingest/jobs');
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('Authorization', 'Bearer ' + credentials.access_token);
    var payload = {
        "object": object,
        "sourceName": source,
        "operation":"upsert"
     };
    client.send(JSON.stringify(payload));
    return JSON.parse(client.text);
}

exports.ingest = function(credentials, jobDetails, file) {
    var client = new HTTPClient();
    client.open('PUT', 'https://' + credentials.instance_url + jobDetails.contentUrl);
    client.setRequestHeader('Content-Type', 'text/csv');
    client.setRequestHeader('Authorization', 'Bearer ' + credentials.access_token);
    client.setTimeout(900000);
    client.send(file);
    const response = JSON.parse(client.text);
    return response;
}

exports.uploadComplete = function(credentials, jobId) {
    var response = updateJob(credentials, jobId, 'PATCH', 'UploadComplete');
    if(response.state != 'UploadComplete') {
        throw 'Error to update job status: ' + jobId;
    }
    return response;
}

exports.getState = function(credentials, jobId) {
    var response = updateJob(credentials, jobId, 'GET');
    return response && response.hasOwnProperty('state') ? response.state : null;
}

function cleanUp(credentials, jobId) {
    updateJob(credentials, jobId, 'PATCH', 'Aborted');
    updateJob(credentials, jobId, 'DELETE');
}
exports.cleanUp = cleanUp;

exports.cleanUpAll = function(credentials) {
    var jobs = getJobs(credentials);
    if(!jobs.hasOwnProperty('data')) return;
    jobs.data.forEach(job => {
        cleanUp(credentials, job.id);
    });
}

function updateJob(credentials, jobId, operation, state) {
    var client = new HTTPClient();
    client.open(operation, 'https://' + credentials.instance_url + '/api/v1/ingest/jobs/' + jobId);
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('Authorization', 'Bearer ' + credentials.access_token);

    var response = operation == 'PATCH' || operation == 'DELETE'
        ? client.send(JSON.stringify({ "state": state }))
        : client.send();

    return JSON.parse(client.text);
}

function getJobs(credentials) {
    var client = new HTTPClient();
    client.open('GET', 'https://' + credentials.instance_url + '/api/v1/ingest/jobs');
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('Authorization', 'Bearer ' + credentials.access_token);
    client.send();
    return JSON.parse(client.text);
}