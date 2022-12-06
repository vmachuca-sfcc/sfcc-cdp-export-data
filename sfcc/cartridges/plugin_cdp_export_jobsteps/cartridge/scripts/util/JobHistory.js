'use strict';

const File = require('dw/io/File');
const FileReader = require('dw/io/FileReader');
const FileWriter = require('dw/io/FileWriter');
const FileUtils = require('./FileUtils');

const FILE_JOB_HISTORY = 'job_ids.txt';

function getFile() {
    const path = FileUtils.getRootFolder() + '/' + FILE_JOB_HISTORY;
    return new File(path);
}

exports.write = function(jobId) {
    var fw = new FileWriter(getFile(), 'UTF-8', true);
    fw.writeLine(jobId);
    fw.close();
}

exports.read = function() {
    var items = [];
    var file = getFile();
    if(!file.exists()) return items;
    var fr = new FileReader(file);
    fr.readLines().toArray().forEach(line => {
        items.push(line);
    });
    fr.close();
    return items;
}

exports.purge = function() {
    var file = getFile();
    if(file.exists()) file.remove();
}

exports.FILE_JOB_HISTORY = FILE_JOB_HISTORY;
