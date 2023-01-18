'use strict';

const CUSTOMER            = { file: 'CustomerProfile',  object: 'Profile' };
const CUSTOMER_ADDRESS    = { file: 'CustomerAddress',  object: 'CustomerAddress' };
const PRODUCT             = { file: 'Product',  object: 'Product' };
const PRODUCT_PRICE_MODEL = { file: 'ProductPriceModel',  object: 'ProductPriceModel' };
const PRODUCT_INVENTORY   = { file: 'ProductInventory',  object: 'ProductInventory' };
const ORDER               = { file: 'Order',  object: 'Order' };
const ORDER_ITEM          = { file: 'OrderItem',  object: 'OrderItem' };
const ORDER_COUPON        = { file: 'OrderCoupon',  object: 'OrderCoupon' };

const SYSTEM_INGEST_LIST = [
    CUSTOMER.file,
    CUSTOMER_ADDRESS.file,
    PRODUCT.file,
    PRODUCT_PRICE_MODEL.file,
    PRODUCT_INVENTORY.file,
    ORDER.file,
    ORDER_ITEM.file,
    ORDER_COUPON.file
];

const SYSTEM_OBJ_INGEST_LIST = [
    CUSTOMER.object,
    CUSTOMER_ADDRESS.object,
    PRODUCT.object,
    PRODUCT_PRICE_MODEL.object,
    PRODUCT_INVENTORY.object,
    ORDER.object,
    ORDER_ITEM.object,
    ORDER_COUPON.object
];

exports.CUSTOMER            = CUSTOMER;
exports.CUSTOMER_ADDRESS    = CUSTOMER_ADDRESS;
exports.PRODUCT             = PRODUCT;
exports.PRODUCT_PRICE_MODEL = PRODUCT_PRICE_MODEL;
exports.PRODUCT_INVENTORY   = PRODUCT_INVENTORY;
exports.ORDER               = ORDER;
exports.ORDER_ITEM          = ORDER_ITEM;
exports.ORDER_COUPON        = ORDER_COUPON;

exports.SYSTEM_INGEST_LIST  = SYSTEM_INGEST_LIST;

exports.isValidObject = function(name) {
    var isValid = false;
    SYSTEM_OBJ_INGEST_LIST.forEach(item => {
        if(item == name) {
            isValid = true;
            return;
        }
    });
    return isValid;
}
