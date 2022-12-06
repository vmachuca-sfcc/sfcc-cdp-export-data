'use strict';

const StringUtils = require('../util/StringUtils');
const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

function getToken(parameters) {
    var svc = LocalServiceRegistry.createService("CDPExportJobStepAuth", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            svc.setURL(parameters.OrgUrl + '/services/oauth2/token');

            var payload = "grant_type=password" +
            "&client_id=" + parameters.ConsumerKey +
            "&client_secret=" + parameters.ConsumerSecret +
            "&username=" + parameters.Username +
            "&password=" + parameters.Password;
            return payload;
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const credentials = svc.call();
    return credentials.object.access_token;
}

function getCdpToken(parameters) {
    var svc = LocalServiceRegistry.createService("CDPExportJobStepCdpAuth", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            svc.setURL(parameters.OrgUrl + '/services/a360/token');

            var payload = "grant_type=urn:salesforce:grant-type:external:cdp" +
            "&subject_token_type=urn:ietf:params:oauth:token-type:access_token" +
            "&subject_token=" + getToken(parameters);
            return payload;
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    const credentials = svc.call();
    return 'Bearer ' + credentials.object.access_token;
}

exports.createIngestJob = function(parameters, fileReader) {
    var svc = LocalServiceRegistry.createService("CDPExportJobInjest", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', 'Bearer ' + getCdpToken(parameters));
            svc.setURL(parameters.OrgUrl + '/api/v1/ingest/jobs');

            var payload = {
                "object": "runner_profiles",
                "sourceName":"Event_API",
                "operation":"upsert"
             };
            return JOSN.stringify(payload);
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    svc.call();
}