'use strict';

const HTTPClient = require('dw/net/HTTPClient');

function getToken(params) {
    var client = new HTTPClient();
    client.open('POST', params.OrgUrl + '/services/oauth2/token');
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var payload = "grant_type=password" +
        "&client_id=" + params.ConsumerKey +
        "&client_secret=" + params.ConsumerSecret +
        "&username=" + params.Username +
        "&password=" + params.Password;

    client.send(payload);
    return JSON.parse(client.text).access_token;
}

exports.getCdpCredentials = function(params) {
    var client = new HTTPClient();
    client.open('POST', params.OrgUrl + '/services/a360/token');
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var payload = "grant_type=urn:salesforce:grant-type:external:cdp" +
        "&subject_token_type=urn:ietf:params:oauth:token-type:access_token" +
        "&subject_token=" + getToken(params);
    client.send(payload);
    return JSON.parse(client.text);
}