import { UserSkillPathState, CareerId } from '../types';
import { CAREERS } from '../data/careers';
import { generateInitialRoadmap } from './roadmapGenerator';

const STORAGE_KEY = 'skillpath_state_v1';

export const DEFAULT_STATE: UserSkillPathState = {
  currentView: 'landing',
  selectedCareerId: null,
  selectedSkills: [],
  customSkills: [],
  roadmapItems: [],
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

export function loadSavedState(): UserSkillPathState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to parse saved state:', err);
    return DEFAULT_STATE;
  }
}

export function saveState(state: UserSkillPathState): void {
  try {
    const updated = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist state:', err);
  }
}

export function clearSavedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear state:', err);
  }
}

/**
 * Creates a rich demo state (Data Analyst with Excel, SQL, Python completed)
 * matching the user prompt's exact example!
 */
export function getDemoState(careerId: CareerId = 'data-analyst'): UserSkillPathState {
  const career = CAREERS.find((c) => c.id === careerId) || CAREERS[0];
  const demoSkills =
    careerId === 'data-analyst'
      ? ['Excel', 'SQL', 'Python']
      : careerId === 'web-developer'
      ? ['HTML', 'CSS', 'JavaScript']
      : ['Python', 'Git', 'Linux'];

  const initialItems = generateInitialRoadmap(career, demoSkills);

  return {
    currentView: 'dashboard',
    selectedCareerId: career.id,
    selectedSkills: demoSkills,
    customSkills: [],
    roadmapItems: initialItems,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}
