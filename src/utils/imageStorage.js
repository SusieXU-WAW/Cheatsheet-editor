// IndexedDB utility for storing pasted images
const DB_NAME = 'CheatsheetImages';
const STORE_NAME = 'images';
const DB_VERSION = 1;

let dbPromise = null;

// Initialize IndexedDB
const initDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });

  return dbPromise;
};

// Save an image to IndexedDB
export const saveImage = async (id, dataUrl) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, dataUrl });

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

// Get an image from IndexedDB
export const getImage = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.dataUrl);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

// Delete an image from IndexedDB
export const deleteImage = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get all image IDs
export const getAllImageIds = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAllKeys();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
