'use strict';

const Status = require('dw/system/Status');
const Logger = require('dw/system/Logger');
const ProductSearchModel = require('dw/catalog/ProductSearchModel');
const ProductMap = require('../map/ProductMap');
const Delta = require('../util/Delta');
const CsvType = require('../file/CsvType');
const CsvFile = require('../file/CsvFile');

const FIELD_PRODUCT_ID = 'productID';

function execute(params, stepExecution) {
    try {
        if(params.SkipData) return new Status(Status.OK);
        createOutputFile(params);
    } catch (error) {
        Logger.error(error.stack);
        Logger.error(error.toString());
        return new Status(Status.ERROR, 'ERROR', error.toString());
    }
    return new Status(Status.OK);
}

function createOutputFile(params) {
    var csvProduct = new CsvFile(CsvType.PRODUCT, params);
    var csvPriceModel = new CsvFile(CsvType.PRODUCT_PRICE_MODEL, params);
    csvPriceModel.addRowFromList(ProductMap.priceModelFields);

    var psm = new ProductSearchModel();
    psm.setCategoryID('root');
    psm.search();

    var psh = psm.getProductSearchHits();
    while(psh.hasNext()) {
        //product
        var product = psh.next().getProduct();
        if(!Delta.isPartOf(product, params)) continue;
        csvProduct.addRow(product);

        //product price model
        if(!product.priceModel) continue;
        var priceModelRow = [];
        ProductMap.priceModelFields.forEach(field => {
            if(field == FIELD_PRODUCT_ID) {
                priceModelRow.push(product.ID);
                return;
            }
            priceModelRow.push(product.priceModel[field]);
        });
        csvPriceModel.addRowFromList(priceModelRow);
    };
    csvProduct.close();
    csvPriceModel.close();
 }

exports.execute = execute;