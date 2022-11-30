'use strict';

exports.uuidv4 = function() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0) {
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

exports.fix = function(data) {
    var str = String(data);
    return str.replace(/([^;])\n/g, '$1 ');
}

exports.toXmlCase = function (str) {
    if(str[0].toUpperCase() === str[0]) return str.toLowerCase();
    return str.split('').map((character) => {
        if (character == character.toUpperCase() && isNaN(character)) {
            return '-' + character.toLowerCase();
        } else {
            return character;
        }
    })
    .join('');
}