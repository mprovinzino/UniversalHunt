export interface PhotoProofRecord {
  challengeId: string;
  dataUrl: string;
  capturedAt: string;
  filename: string;
}

const DB_NAME = 'universal-hunt-db';
const DB_VERSION = 1;
const PHOTO_STORE = 'photo-proofs';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'challengeId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB.'));
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  });
}

function withStore<T>(
  mode: IDBTransactionMode,
  handler: (store: IDBObjectStore, resolve: (value: T) => void, reject: (error: Error) => void) => void,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(PHOTO_STORE, mode);
        const store = tx.objectStore(PHOTO_STORE);
        handler(store, resolve, reject);

        tx.oncomplete = () => db.close();
        tx.onerror = () => {
          reject(tx.error ?? new Error('IndexedDB transaction failed.'));
          db.close();
        };
      }),
  );
}

export async function savePhotoProof(challengeId: string, file: File): Promise<PhotoProofRecord> {
  const dataUrl = await readFileAsDataUrl(file);
  const record: PhotoProofRecord = {
    challengeId,
    dataUrl,
    capturedAt: new Date().toISOString(),
    filename: file.name || `${challengeId}.jpg`,
  };

  return withStore<PhotoProofRecord>('readwrite', (store, resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error ?? new Error('Unable to save photo proof.'));
  });
}

export function getPhotoProof(challengeId: string): Promise<PhotoProofRecord | null> {
  return withStore<PhotoProofRecord | null>('readonly', (store, resolve, reject) => {
    const request = store.get(challengeId);
    request.onsuccess = () => resolve((request.result as PhotoProofRecord | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('Unable to load photo proof.'));
  });
}

export function getAllPhotoProofs(): Promise<PhotoProofRecord[]> {
  return withStore<PhotoProofRecord[]>('readonly', (store, resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve((request.result as PhotoProofRecord[]) ?? []);
    request.onerror = () => reject(request.error ?? new Error('Unable to list photo proofs.'));
  });
}

export function deletePhotoProof(challengeId: string): Promise<void> {
  return withStore<void>('readwrite', (store, resolve, reject) => {
    const request = store.delete(challengeId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Unable to delete photo proof.'));
  });
}
