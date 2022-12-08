'use strict';

const HTTPClient = require('dw/net/HTTPClient');
const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

exports.createJob = function(credentials, object, source) {
    var svc = LocalServiceRegistry.createService("CDPDataIngestJob", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', 'Bearer ' + credentials.access_token);
            svc.setURL('https://' + credentials.instance_url + '/api/v1/ingest/jobs');

            var payload = {
                "object": object,
                "sourceName": source,
                "operation":"upsert"
             };
            return JSON.stringify(payload);
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const response = svc.call();
    if(response.status == 'ERROR') {
        throw 'Error to create job to object: ' + object;
    }
    return response;
}

exports.ingest = function(credentials, jobDetails, file) {
    var client = new HTTPClient();
    client.open('PUT', 'https://' + credentials.instance_url + jobDetails.contentUrl);
    client.setRequestHeader('Content-Type', 'text/csv');
    client.setRequestHeader('Authorization', 'Bearer ' + credentials.access_token);
    client.setTimeout(900000);
    client.send(file);
    const response = JSON.stringify(client.text);
    return response;
}

exports.uploadComplete = function(credentials, jobId) {
    var svc = LocalServiceRegistry.createService("CDPDataIngestJob", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('PATCH');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', 'Bearer ' + credentials.access_token);
            svc.setURL('https://' + credentials.instance_url + '/api/v1/ingest/jobs/' + jobId);
            var payload = {
                "state": "UploadComplete"
             };
            return JSON.stringify(payload);
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const response = svc.call();
    if(response.status == 'ERROR') {
        throw 'Error to update job status: ' + jobId;
    }
    return response;
}

exports.getState = function(credentials, jobId) {
    var svc = LocalServiceRegistry.createService("CDPDataIngestJob", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('GET');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', 'Bearer ' + credentials.access_token);
            svc.setURL('https://' + credentials.instance_url + '/api/v1/ingest/jobs/' + jobId);
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const response = svc.call();
    return response.hasOwnProperty('object') ? response.object.state : null;
}

exports.cleanUp = function(credentials, jobId) {
    var svcAbort = LocalServiceRegistry.createService("CDPDataIngestJob", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('PATCH');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', 'Bearer ' + credentials.access_token);
            svc.setURL('https://' + credentials.instance_url + '/api/v1/ingest/jobs/' + jobId);
            var payload = {
                "state": "Aborted"
             };
            return JSON.stringify(payload);
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const response1 = svcAbort.call();
    var svcDelete = LocalServiceRegistry.createService("CDPDataIngestJob", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('DELETE');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', 'Bearer ' + credentials.access_token);
            svc.setURL('https://' + credentials.instance_url + '/api/v1/ingest/jobs/' + jobId);
            return;
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const response2 = svcDelete.call();
}