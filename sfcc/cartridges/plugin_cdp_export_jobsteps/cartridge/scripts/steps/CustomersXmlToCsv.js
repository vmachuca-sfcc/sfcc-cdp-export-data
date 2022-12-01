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
const Describer = require('../util/Describer');
const CsvUtils = require('../util/CsvUtils');
const JsonUtils = require('../util/JsonUtils');
const FileUtils = require('../util/FileUtils');
const StringUtils = require('../util/StringUtils');

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
    var fileReader = new FileReader(new File(inputFile));
    var fileWriter = new FileWriter(new File(outputFile), 'UTF-8');
    var xsr = new XMLStreamReader(fileReader);
    var csv = new CSVStreamWriter(fileWriter);

    var outputFile2 = FileUtils.getFilePath(parameters.FileNameAddress, 'csv');
    var fileWriter2 = new FileWriter(new File(outputFile2), 'UTF-8');
    var csv2 = new CSVStreamWriter(fileWriter2);

    var describeProfile = Describer.getProfile();
    csv.writeNext(CsvUtils.buildHeader(describeProfile));

    var describeAddress = Describer.getCustomerAddress();
    var addressCols = JsonUtils.removeItem(CsvUtils.buildHeader(describeAddress), 'ID');
    addressCols.unshift('customerNo');
    csv2.writeNext(addressCols);

    while (xsr.hasNext()) {
        if (
            xsr.next() == XMLStreamConstants.START_ELEMENT &&
            xsr.getLocalName() == 'customer'
        ) {
            var row = [];
            var customerNo = '';
            var uuid = StringUtils.uuidv4();
            var customerData = Parser.parse(
                xsr.readXMLObject().toXMLString(),
                {
                    attrNodeName: 'attribute-id',
                    ignoreAttributes: false,
                    parseAttributeValue: true
                }
            );
            //customer data
            describeProfile.attributeDefinitions.toArray().forEach((def) => {
                if(def.ID == 'customerNo') {
                    customerNo = customerData.customer['attribute-id']['@_customer-no'];
                    row.push(customerNo);
                    return;
                }
                if(def.ID == 'UUID') {
                    row.push(uuid);
                    return;
                }
                if(def.system) {
                    const xmlField = StringUtils.toXmlCase(def.ID);
                    row.push(JsonUtils.getAttributeValue(customerData.customer.profile, xmlField));
                    return;
                }
                if(customerData.customer.profile.hasOwnProperty('custom-attributes')) {
                    row.push(JsonUtils.getCustomAttributeValue(customerData.customer.profile, def.ID));
                    return;
                }
                row.push('');
            });
            csv.writeNext(row);

            //address
            if(!customerData.customer.hasOwnProperty('addresses')) return;
            var addresslist = [];
            if(customerData.customer.addresses.address.hasOwnProperty('address1')) {
                addresslist.push(customerData.customer.addresses.address);
            } else {
                customerData.customer.addresses.address.forEach(a => addresslist.push(a));
            }
            addresslist.forEach((address) => {
                var rowAddress = [];
                rowAddress.push(customerNo);
                describeAddress.attributeDefinitions.toArray().forEach((def) => {
                    if(def.ID == 'ID') return;
                    if(def.ID == 'UUID') {
                        rowAddress.push(StringUtils.uuidv4());
                        return;
                    }
                    const xmlField = StringUtils.toXmlCase(def.ID);
                    rowAddress.push(
                        def.system
                            ? JsonUtils.getAttributeValue(address, xmlField)
                            : JsonUtils.getCustomAttributeValue(address, def.ID)
                    );
                });
                csv2.writeNext(rowAddress);
            });
        }
    }
    csv.close();
    csv2.close();
    fileWriter.close();
    fileWriter2.close();
    fileReader.close();
}

exports.execute = execute;