import { CharacterProfile } from '../types';
import { sampleCharacters } from '../data/sampleCharacters';

const STORAGE_KEY = 'erotic_character_architect_profiles';
const ACTIVE_CHAR_KEY = 'erotic_character_architect_active_id';

export function getStoredCharacters(): CharacterProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial sample characters
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCharacters));
      return sampleCharacters;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return sampleCharacters;
  } catch (err) {
    console.error('Error loading characters from storage:', err);
    return sampleCharacters;
  }
}

export function saveCharacters(characters: CharacterProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  } catch (err) {
    console.error('Error saving characters to storage:', err);
  }
}

export function getActiveCharacterId(): string {
  try {
    const active = localStorage.getItem(ACTIVE_CHAR_KEY);
    if (active) return active;
  } catch (err) {
    console.error('Error reading active character id:', err);
  }
  return sampleCharacters[0].id;
}

export function setActiveCharacterId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_CHAR_KEY, id);
  } catch (err) {
    console.error('Error setting active character id:', err);
  }
}
