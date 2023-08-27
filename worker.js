let db;

async function initDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyDatabase", 1);

    request.onerror = function(event) {
      reject("Database error:", event.target.error);
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      resolve();
    };

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore("chunks", { autoIncrement: true });
    };
  });
}

function writeToIndexedDB(data, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["chunks"], "readwrite");
    const objectStore = transaction.objectStore("chunks");
    const request = objectStore.add(data, key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (e) => {
      reject(new Error("Error writing to IndexedDB: " + e.target.error));
    };
  });
}

self.onmessage = async (e) => {
  await initDb();
  const {file, type, key} = e.data;
  if (type === 'parse') {
    const text = cleanText(await parseFile(file))
    const words = text.split(' ');
    const wordCount = words.length;
    const chunks = [];
    const chunkSize = 10;
    for (let i = 0; i < wordCount; i += chunkSize) {
      chunks.push({
        chunk: words.slice(i, i + chunkSize).join(' '),
        start: i === 0 ? 0 : i + 1,
        end: i + chunkSize
      });
    }
    writeToIndexedDB({chunks, wordCount}, file.name).then(() => {
      getData(file.name);
    })
  }
    if (type === 'get') {
      getData(key);
    }
};

function getData(key) {
  const transaction = db.transaction(["chunks"], "readonly");
  const objectStore = transaction.objectStore("chunks");
  const request = objectStore.get(key);
  request.onsuccess = function(event) {
    self.postMessage({
      chunks: event.target.result.chunks,
      wordCount: event.target.result.wordCount,
      type: 'get'
    });
  };
}

function cleanText(text) {
  text = text.replace(/\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim();
  return text;
}

async function parseFile(file) {
  if (!file) {
    return ''
  }
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function(event) {
      if (!event.target) {
        return resolve('')
      }
      if (file.type === 'text/plain') {
        return resolve(event.target.result);
      }
    };

    reader.onerror = function() {
      resolve('')
    };
    reader.readAsText(file);
  })

}