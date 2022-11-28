'use strict';

const StringUtils = require('../util/StringUtils');
const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

exports.uploadCsvFile = function(parameters, fileReader) {
    var svc = LocalServiceRegistry.createService("CDPExportJobStepUploadCsvFile", {
        createRequest: function(svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'multipart/form-data; boundary=boundary_string');
            svc.addHeader('Authorization', getAuthorization(parameters));
            svc.setURL(parameters.OrgUrl + '/services/data/v55.0/sobjects/ContentVersion');

            const fileName = parameters.FileName + '_' + StringUtils.uuidv4() + '.csv';
            var payload = '--boundary_string\nContent-Disposition: form-data; name="entity_content";\n';
            payload += 'Content-Type: application/json\n\n{\n    "PathOnClient" : "' + fileName + '"\n}\n\n';
            payload += '--boundary_string\nContent-Type: application/octet-stream\n';
            payload += 'Content-Disposition: form-data; name="VersionData"; filename="' + fileName + '"\n\n';
            payload += fileReader.readString() + '\n';
            payload += '--boundary_string--';
            return payload;
        },
        parseResponse: function (svc, result) {
            return JSON.parse(result.text);
        }
    });
    svc.call();
}

function getAuthorization(parameters) {
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
    return 'Bearer ' + credentials.object.access_token;
}