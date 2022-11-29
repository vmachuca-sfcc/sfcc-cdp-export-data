'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const File = require('dw/io/File');
const FileReader = require('dw/io/FileReader');
const FileWriter = require('dw/io/FileWriter');
const XMLStreamReader = require('dw/io/XMLStreamReader');
const XMLStreamConstants = require('dw/io/XMLStreamConstants');
const CSVStreamWriter = require('dw/io/CSVStreamWriter');
const Parser = require('fast-xml-parser/parser');
const JsonUtils = require('../util/JsonUtils');
const FileUtils = require('../util/FileUtils');

function execute(parameters, stepExecution) {
    try {
        createOutputFile(parameters);
    } catch (error) {
      Logger.error('An error has occurred: {0}', error.toString());
      return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createOutputFile(parameters) {
    var inputFile = FileUtils.getRootFilePath(parameters.FileName, 'xml');
    var outputFile = FileUtils.getFilePath(parameters.FileName, 'csv');
    var profileFields = parameters.ProfileFileds.split(FileUtils.COMMA_CHAR);
    var customFields = parameters.CustomFields.split(FileUtils.COMMA_CHAR);
    var addressFields = parameters.AddressFields.split(FileUtils.COMMA_CHAR);
    var fileReader = new FileReader(new File(inputFile));
    var fileWriter = new FileWriter(new File(outputFile), 'UTF-8');
    var xsr = new XMLStreamReader(fileReader);
    var csv = new CSVStreamWriter(fileWriter);

    //columns
    const cols = profileFields.concat(customFields).concat(addressFields);
    csv.writeNext(cols);

    //rows
    while (xsr.hasNext()) {
        if (
            xsr.next() == XMLStreamConstants.START_ELEMENT &&
            xsr.getLocalName() == 'customer'
        ) {
            var row = [];

            //parse xml to json
            var customerData = Parser.parse(
                xsr.readXMLObject().toXMLString(),
                {
                    attrNodeName: 'attribute-id',
                    ignoreAttributes: false,
                    parseAttributeValue: true
                }
            );

            //profile attributes
            profileFields.forEach((field) => {
                row.push(
                    customerData.customer.hasOwnProperty('profile')
                    ? JsonUtils.getAttributeValue(customerData.customer.profile, field)
                    : ''
                );
            });

            //custom attributes
            customFields.forEach((field) => {
                row.push(
                    customerData.customer.hasOwnProperty('profile') &&
                    customerData.customer.profile.hasOwnProperty('custom-attributes')
                    ? JsonUtils.getCustomAttributeValue(customerData.customer.profile, field)
                    : ''
                );
            });

            //address
            addressFields.forEach((field) => {
                row.push(
                    customerData.customer.hasOwnProperty('addresses')
                    ? JsonUtils.getAttributeValue(customerData.customer.addresses.address, field)
                    : ''
                );
            });

            csv.writeNext(row);
        }
    }
    csv.close();
    fileWriter.close();
    fileReader.close();
}

exports.execute = execute;