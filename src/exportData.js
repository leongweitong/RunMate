export function exportData(dbName, storeName) {
    return new Promise((resolve, reject) => {
        // Open the IndexedDB
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const data = [];

            // Read all data using a cursor
            objectStore.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue(); // Continue to the next record
                } else {
                    // Once done reading, convert to JSON
                    const jsonData = JSON.stringify(data, null, 2);
                    const blob = new Blob([jsonData], { type: "application/json" });

                    // Save the file depending on the environment (Cordova or Browser)
                    if (window.cordova) {
                        // Cordova/Android environment
                        saveToFileCordova(blob, `${storeName}.json`)
                            .then(() => {
                                resolve("Data exported successfully!");
                            })
                            .catch(error => {
                                alert(`Error saving file: ${error}`);
                                reject(error);
                            });
                    } else {
                        // Browser environment
                        saveToFileBrowser(blob, `${storeName}.json`);
                        resolve("Data exported successfully in browser.");
                    }
                }
            };

            objectStore.openCursor().onerror = function(event) {
                reject("Error fetching data from IndexedDB.");
            };
        };

        request.onerror = function(event) {
            reject("Error opening IndexedDB.");
        };
    });
}

// Cordova: Save the file to the Downloads folder
function saveToFileCordova(blob, fileName) {
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

// Browser: Trigger a download of the file
function saveToFileBrowser(blob, fileName) {
    // Create a temporary anchor element
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = fileName;  // The file name that will appear to the user
    document.body.appendChild(link);
    link.click();  // Trigger the download
    document.body.removeChild(link);  // Clean up the DOM
    
    URL.revokeObjectURL(url);  // Free up memory
}
