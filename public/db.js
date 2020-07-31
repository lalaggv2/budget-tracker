const databaseName = "transaction";
const storeName = "transactionStore"
const request = window.indexedDB.open(databaseName, 1);
let db,
  // tx,
  // store;

  request.onupgradeneeded = (evt) => {
    const db = request.result;
    db.createObjectStore(storeName, { keyPath: "_id" });
  };

request.onerror = function (evt) {
  console.log("There was an error");
};

request.onsuccess = function (evt) {
  db = request.result;
  tx = db.transaction(storeName, "readwrite");
  store = tx.objectStore(storeName);

  db.onerror = function (evt) {
    console.log("error");
  };

};

const saveRecord = (record) => {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}

const checkDatabase = () => {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAllRecords = store.getAllRecords();

  getAllRecords.onsuccess = () => {
    if (getAllRecords.result.length > 0) {
      fetch("./api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAllRecords.result),
        headers: {
          Accept: "applications/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          const transaciotn = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

window.addEventListener('online', checkDatabase);

// const saveOffline = () => {