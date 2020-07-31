const databaseName = "transaction";
//const storeName = "transactionStore"
const request = window.indexedDB.open(databaseName, 1);
let db;

request.onupgradeneeded = (evt) => {
  const db = evt.target.result;
  db.createObjectStore("pendingTx", { autoIncrement: true });
};

request.onerror = function (evt) {
  console.log("There was an error" + evt.target.errorCode);
};

request.onsuccess = function (evt) {
  db = evt.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
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

