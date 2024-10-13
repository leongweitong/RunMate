export function importData(dbName, storeName, jsonFile) {
    return new Promise((resolve, reject) => {
        // Function to handle IndexedDB import
        const handleIndexedDBImport = (data) => {
            const request = indexedDB.open(dbName);

            request.onsuccess = function (event) {
                const db = event.target.result;
                const transaction = db.transaction([storeName], "readwrite");
                const objectStore = transaction.objectStore(storeName);

                const promises = data.map((item) => {
                    return new Promise((resolve, reject) => {
                        const checkRequest = objectStore.get(item.id); // Check if record already exists

                        checkRequest.onsuccess = function (event) {
                            const existingRecord = event.target.result;

                            if (existingRecord) {
                                // Record exists, so generate a new unique ID (e.g., timestamp)
                                item.id = new Date().getTime() + Math.random(); // Or use your preferred unique ID method
                            }

                            // Insert the record (either with a new ID or the existing one)
                            const putRequest = objectStore.put(item);

                            putRequest.onsuccess = function () {
                                resolve();
                            };

                            putRequest.onerror = function () {
                                reject("Error adding the new record.");
                            };
                        };

                        checkRequest.onerror = function () {
                            reject("Error checking existing record.");
                        };
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        transaction.oncomplete = function () {
                            resolve("Data imported successfully! All new records appended.");
                        };

                        transaction.onerror = function () {
                            reject("Error importing data into IndexedDB.");
                        };
                    })
                    .catch((error) => {
                        reject(`Error during the import process: ${error}`);
                    });
            };

            request.onerror = function () {
                reject("Error opening IndexedDB.");
            };
        };

        // Check if the app is running in a Cordova environment
        if (window.cordova) {
            // Cordova environment: use Cordova's FileReader
            const fileReader = new FileReader();

            fileReader.onloadend = function () {
                try {
                    const data = JSON.parse(fileReader.result); // Parse the JSON
                    handleIndexedDBImport(data); // Import the data into IndexedDB
                } catch (error) {
                    reject("Error parsing JSON file in Cordova.");
                }
            };

            fileReader.onerror = function () {
                reject("Error reading JSON file in Cordova.");
            };

            // Read the file using Cordova's File plugin
            fileReader.readAsText(jsonFile);
        } else {
            // Browser environment: use native FileReader
            const reader = new FileReader();

            reader.onload = function (event) {
                try {
                    const data = JSON.parse(event.target.result);  // Parse the uploaded JSON
                    handleIndexedDBImport(data); // Import the data into IndexedDB
                } catch (error) {
                    reject("Error parsing JSON file in the browser.");
                }
            };

            reader.onerror = function () {
                reject("Error reading the JSON file.");
            };

            // Read the JSON file as text
            reader.readAsText(jsonFile);
        }
    });
}
