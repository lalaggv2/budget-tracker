const databaseName = "transaction";
const storeName = "transactionStore"
const request = window.indexedDB.open(databaseName, 1);
let db,
  tx,
  store;

request.onupgradeneeded = function (e) {
  const db = request.result;
  db.createObjectStore(storeName, { keyPath: "_id" });
};

request.onerror = function (e) {
  console.log("There was an error");
};

request.onsuccess = function (e) {
  db = request.result;
  tx = db.transaction(storeName, "readwrite");
  store = tx.objectStore(storeName);

  db.onerror = function (e) {
    console.log("error");
  };
  // if (method === "put") {
  //   store.put(object);
  // } else if (method === "get") {
  //   const all = store.getAll();
  //   all.onsuccess = function () {
  //     resolve(all.result);
  //   };
  // } else if (method === "delete") {
  //   store.delete(object._id);
  // }
  // tx.oncomplete = function () {
  //   db.close();
  // };
};

const saveRecord = (transaction) => {
  const request = window.indexedDB.open(databaseName, 1);
  tx = db.transaction(storeName, "readwrite");
  store = tx.objectStore(storeName);
  store.put({})
}

const saveOffline = () => {

}