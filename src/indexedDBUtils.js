export const getGoalsByStatus = (status) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MyDB', 5); // Replace 'MyDB' with your database name and version
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('goal', 'readonly');
        const store = transaction.objectStore('goal');
        const index = store.index('status'); // Ensure 'status' is the name of the index in your schema
  
        const request = index.getAll(status); // Fetch all records with the specified status
        request.onsuccess = (event) => {
          resolve(event.target.result); // Resolve with all results
        };
        request.onerror = (event) => {
          reject(event.target.error); // Handle errors
        };
      };
      request.onerror = (event) => {
        reject(event.target.error); // Handle errors
      };
    });
};
  