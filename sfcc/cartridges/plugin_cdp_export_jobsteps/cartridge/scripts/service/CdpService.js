'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

exports.createJob = function(credentials, object, source) {
    var svc = LocalServiceRegistry.createService("CDPCreateJob", {
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
    return response;
}

exports.ingest = function(credentials, jobDetails, payload) {
    var svc = LocalServiceRegistry.createService("CDPIngest", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('PUT');
            svc.addHeader('Content-Type', 'text/csv');
            svc.addHeader('Authorization', 'Bearer ' + credentials.access_token);
            svc.setURL('https://' + credentials.instance_url + jobDetails.contentUrl);
            return payload;
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const response = svc.call();
    return response.object;
}

exports.cleanUp = function(credentials, jobId) {
    var svcAbort = LocalServiceRegistry.createService("CDPAbortJob", {
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
    var svcDelete = LocalServiceRegistry.createService("CDPDeleteJob", {
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