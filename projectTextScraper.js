"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function getAllFilesInFolder(dir) {
    var files = [];
    var items = fs.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (item.isFile()) {
            files.push(path.join(dir, item.name));
        }
        else if (item.isDirectory()) {
            files.push.apply(files, getAllFilesInFolder(path.join(dir, item.name)));
        }
    }
    return files;
}
function getFileCode(codeFilePath) {
    try {
        var fileContent = fs.readFileSync(codeFilePath, 'utf-8');
        return fileContent;
    }
    catch (error) {
        console.error('Error reading file:', error);
        process.exit();
    }
}
function starter() {
    var filePath = "projectCode.txt";
    var fileContent = "";
    var folderPath = './src'; // Replace with your folder path
    var allFiles = getAllFilesInFolder(folderPath);
    allFiles.forEach(function (file) {
        fileContent += "--- " + file + " ---\n\n";
        fileContent += getFileCode(file);
        fileContent += '\n\n';
    });
    fs.writeFileSync(filePath, fileContent);
    console.log("All code concatenated and written to ".concat(filePath));
}
starter();
