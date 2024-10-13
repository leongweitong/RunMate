export function saveToFileCordova(blob, fileName) {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + 'Download/', function(directoryEntry) {
            directoryEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function() {
                        resolve(`File written successfully at: ${fileEntry.nativeURL}`);
                    };

                    fileWriter.onerror = function(error) {
                        reject(`Error writing file: ${error}`);
                    };

                    fileWriter.write(blob);
                }, function(error) {
                    reject(`Error creating writer: ${error}`);
                });
            }, function(error) {
                reject(`Error getting file: ${error}`);
            });
        }, function(error) {
            reject(`Error accessing file system: ${error}`);
        });
    });
}