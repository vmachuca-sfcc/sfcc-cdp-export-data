'use strict';

const mapping = [
    {
        b2cName: 'trf_Bowls___Model',
        cdpName: 'trf_Bowls_Model'
    },
    {
        b2cName: 'trf_Bowls___Steel_type',
        cdpName: 'trf_Bowls_Steel_type'
    },
    {
        b2cName: 'trf_Capacidad_DIN___NEMA',
        cdpName: 'trf_Capacidad_DIN_NEMA'
    },
    {
        b2cName: 'trf_Commercial_lina___Porcelain',
        cdpName: 'trf_Commercial_lina_Porcelain'
    },
    {
        b2cName: 'trf_Composition___Quantity',
        cdpName: 'trf_Composition_Quantity'
    },
    {
        b2cName: 'trf_Lid___Model',
        cdpName: 'trf_Lid_Model'
    },
    {
        b2cName: 'trf_Model___Professional_Kitchens',
        cdpName: 'trf_Model_Professional_Kitchens'
    },
    {
        b2cName: 'trf_Moldeds_Circuit_Breakers_and_Accessories',
        cdpName: 'trf_Moldeds_CircuitBreakersNAccessories'
    },
    {
        b2cName: 'trf_Residual__Circuit_Breakers',
        cdpName: 'trf_Residual_Circuit_Breakers'
    },
    {
        b2cName: 'trf_Size___Capacity',
        cdpName: 'trf_Size_Capacity'
    },
    {
        b2cName: 'trf_Size___Total_Length',
        cdpName: 'trf_Size_Total_Length'
    },
    {
        b2cName: 'trf_Upholstered___Mood',
        cdpName: 'trf_Upholstered_Mood'
    }
];

function getCdpName(field) {
    var value = null;
    mapping.forEach(item => {
        if(item.b2cName == field)
            value = item.cdpName;
    });
    return value;
}

exports.check = function(headers) {
    var items = [];
    headers.forEach(field => {
        var value = getCdpName(field);
        items.push(value == null ? field : value);
    });
    return items;
}