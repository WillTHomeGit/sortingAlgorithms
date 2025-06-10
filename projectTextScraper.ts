import * as fs from 'fs';
import * as path from 'path';



function getAllFilesInFolder(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
    if (item.isFile()) {
        files.push(path.join(dir, item.name));
    } else if (item.isDirectory()) {
        files.push(...getAllFilesInFolder(path.join(dir, item.name)));
    }
    }
    return files;
}



function getFileCode(codeFilePath: string): string {
    try {
     const fileContent: string = fs.readFileSync(codeFilePath, 'utf-8');
     return fileContent;
    } catch (error) {
     console.error('Error reading file:', error);
     process.exit();
    }
}

function starter() {
    const filePath: string = "projectCode.txt";
    let fileContent: string = "";
    const folderPath = './src'; // Replace with your folder path
    const allFiles: string[] = getAllFilesInFolder(folderPath);
    allFiles.forEach(file => {
        fileContent += "--- " + file + " ---\n\n";
        fileContent += getFileCode(file);
        fileContent += '\n\n';
    });
    fs.writeFileSync(filePath, fileContent);
    console.log(`All code concatenated and written to ${filePath}`);
}

starter();

