import {
  openDB,
  DBSchema
} from 'idb';
import {
  Tab
} from '../state/notepad';

const DB_NAME = 'notepad-db';
const DB_VERSION = 1;
const STORE_NAME = 'notepadState';
const STATE_KEY = 'appState';

export interface NotepadState {
  tabs: Tab[];
  activeTabId: string | null;
}

interface NotepadDB extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: NotepadState;
  };
}

const dbPromise = openDB < NotepadDB > (DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export const saveStateToDB = async (state: NotepadState) => {
  try {
    const db = await dbPromise;
    await db.put(STORE_NAME, state, STATE_KEY);
  } catch (error) {
    console.error("Failed to save state to DB:", error);
  }
};

export const loadStateFromDB = async (): Promise < NotepadState | null > => {
  try {
    const db = await dbPromise;
    const state = await db.get(STORE_NAME, STATE_KEY);
    return state || null;
  } catch (error) {
    console.error("Failed to load state from DB:", error);
    return null;
  }
};
