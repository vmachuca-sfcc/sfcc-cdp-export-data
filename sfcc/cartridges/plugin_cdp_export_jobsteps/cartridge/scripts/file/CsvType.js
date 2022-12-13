'use strict';

const CUSTOMER            = { file: 'CustomerProfile',  object: 'Profile' };
const CUSTOMER_ADDRESS    = { file: 'CustomerAddress',  object: 'CustomerAddress' };
const PRODUCT             = { file: 'Product',  object: 'Product' };
const PRODUCT_PRICE_MODEL = { file: 'ProductPriceModel',  object: 'ProductPriceModel' };
const ORDER               = { file: 'Order',  object: 'Order' };
const ORDER_ITEM          = { file: 'OrderItem',  object: 'OrderItem' };

const SYSTEM_INGEST_LIST = [
    CUSTOMER.file,
    CUSTOMER_ADDRESS.file,
    PRODUCT.file,
    PRODUCT_PRICE_MODEL.file,
    ORDER.file,
    ORDER_ITEM.file
];

exports.CUSTOMER            = CUSTOMER;
exports.CUSTOMER_ADDRESS    = CUSTOMER_ADDRESS;
exports.PRODUCT             = PRODUCT;
exports.PRODUCT_PRICE_MODEL = PRODUCT_PRICE_MODEL;
exports.ORDER               = ORDER;
exports.ORDER_ITEM          = ORDER_ITEM;

exports.SYSTEM_INGEST_LIST  = SYSTEM_INGEST_LIST;
