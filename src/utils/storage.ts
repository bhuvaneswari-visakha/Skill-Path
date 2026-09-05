import { UserSkillPathState, CareerId, UserProfile } from '../types';
import { CAREERS } from '../data/careers';
import { generateInitialRoadmap } from './roadmapGenerator';

const STORAGE_KEY = 'skillpath_state_v1';
const USERS_STORAGE_KEY = 'skillpath_registered_users_v1';

export interface StoredUserAccount {
  profile: UserProfile;
  passwordHash: string;
}

export const DEMO_USER: UserProfile = {
  id: 'demo-user-1',
  name: 'Alex Chen',
  email: 'alex.student@skillpath.dev',
  careerGoal: 'data-analyst',
  experienceLevel: 'Final-Year Student',
  joinedAt: new Date().toISOString(),
};

export const DEFAULT_STATE: UserSkillPathState = {
  currentView: 'landing',
  currentUser: null,
  selectedCareerId: null,
  selectedSkills: [],
  customSkills: [],
  roadmapItems: [],
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

export function getStoredAccounts(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Seed default demo user account
      const seed: StoredUserAccount[] = [
        {
          profile: DEMO_USER,
          passwordHash: 'password123',
        },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get stored accounts:', err);
    return [];
  }
}

export function registerNewUser(
  name: string,
  email: string,
  password: string,
  careerGoal?: string,
  experienceLevel?: string
): { success: boolean; user?: UserProfile; error?: string } {
  try {
    const accounts = getStoredAccounts();
    const normalizedEmail = email.trim().toLowerCase();

    if (accounts.some((a) => a.profile.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      careerGoal,
      experienceLevel: experienceLevel || 'Student / Job Seeker',
      joinedAt: new Date().toISOString(),
    };

    accounts.push({
      profile: newUser,
      passwordHash: password,
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
    return { success: true, user: newUser };
  } catch (err) {
    return { success: false, error: 'Registration failed due to a storage error.' };
  }
}

export function authenticateUser(
  email: string,
  password: string
): { success: boolean; user?: UserProfile; error?: string } {
  try {
    const accounts = getStoredAccounts();
    const normalizedEmail = email.trim().toLowerCase();
    const match = accounts.find((a) => a.profile.email.toLowerCase() === normalizedEmail);

    if (!match) {
      return { success: false, error: 'No account found with this email. Please sign up.' };
    }

    if (match.passwordHash !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    return { success: true, user: match.profile };
  } catch (err) {
    return { success: false, error: 'Authentication failed.' };
  }
}

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
