'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

function getToken(parameters) {
    var svc = LocalServiceRegistry.createService("CDPCoreAuth", {
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
    return svc.call().object.access_token;
}

exports.getCdpCredentials = function(parameters) {
    var svc = LocalServiceRegistry.createService("CDPAuth", {
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
    return svc.call().object;
}