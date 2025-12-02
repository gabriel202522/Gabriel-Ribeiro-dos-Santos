export interface UserProfile {
  name: string;
  onboardingComplete: boolean;
  spiritualChallenge: string[]; // Changed to array for multi-select
  bibleFrequency: string;
  isNewBeliever: boolean;
  transformAreas: string[];
  devotionalPreference: 'short' | 'deep';
  interestThemes: string[];
  lastDevotionalDate?: string; // Tracks the date of the last completed devotional
  restorationPlan?: RestorationPlan;
  stats: {
    intimacy: number; // 0 to 1000 for slower growth
    reading: number;
    comprehension: number;
    peace: number;
    consistency: number;
    streak: number;
  };
}

export interface RestorationPlan {
  active: boolean;
  startDate: string;
  areas: string[];
  days: {
    day: number;
    title: string;
    content: string;
    task: string;
    completed: boolean;
  }[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  type: 'voice' | 'prayer' | 'gratitude';
  tags?: string[];
}

export interface Habit {
  id: string;
  title: string;
  completed: boolean;
  type: 'prayer' | 'reading' | 'fasting' | 'other';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
