import Dexie, { type Table } from 'dexie';
import type { ImageInput, ImageAnalysis } from '@/lib/gemini/client';

export interface HistoryItem {
  id?: number;
  date: number; // timestamp
  images: ImageInput[]; // base64 images that were uploaded
  fluxPrompt: string;
  detailedPrompt: string;
  negativePrompt?: string;
  aspectRatio: string;
  stylePreset: string;
  weights: {
    base: number;
    character: number;
    pose: number;
    setting: number;
  };
}

export interface SavedCharacter {
  id?: number;
  name: string;
  thumbnail: string; // base64 data URL of the character image
  characterData: ImageAnalysis['character']; // The forensic character analysis
  createdAt: number;
}

export class PromsDatabase extends Dexie {
  history!: Table<HistoryItem>;
  characters!: Table<SavedCharacter>;

  constructor() {
    super('PromsDatabase');
    this.version(2).stores({
      history: '++id, date',
      characters: '++id, name, createdAt'
    });
  }
}

export const db = new PromsDatabase();

export async function saveToHistory(item: Omit<HistoryItem, 'id'>) {
  try {
    const count = await db.history.count();
    if (count >= 50) {
      const oldest = await db.history.orderBy('date').first();
      if (oldest && oldest.id) {
        await db.history.delete(oldest.id);
      }
    }
    await db.history.add(item);
  } catch (error) {
    console.error("Failed to save history: ", error);
  }
}

export async function deleteHistoryItem(id: number) {
  await db.history.delete(id);
}

export async function clearHistory() {
  await db.history.clear();
}

// --- Character Continuity ---
export async function saveCharacter(char: Omit<SavedCharacter, 'id'>) {
  return db.characters.add(char);
}

export async function deleteCharacter(id: number) {
  await db.characters.delete(id);
}

export async function getAllCharacters() {
  return db.characters.orderBy('createdAt').reverse().toArray();
}

