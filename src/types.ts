export type CareerId =
  | 'data-analyst'
  | 'web-developer'
  | 'ai-engineer'
  | 'cloud-engineer'
  | 'backend-developer'
  | 'software-developer'
  | 'cybersecurity-analyst';

export type SkillCategory =
  | 'Foundations'
  | 'Programming'
  | 'Data & Analytics'
  | 'Frameworks & Libraries'
  | 'Cloud & DevOps'
  | 'Security & Systems'
  | 'Tools & Workflow'
  | 'Portfolio & Practice';

export type SkillPriority = 'Essential' | 'High' | 'Recommended';

export type SkillStatus = 'Not Started' | 'Learning' | 'Completed';

export interface CareerSkill {
  name: string;
  category: SkillCategory;
  priority: SkillPriority;
  stageNumber: 1 | 2 | 3 | 4;
  whyItMatters: string;
  recommendedAction: string;
  estimatedHours?: number;
}

export interface Career {
  id: CareerId;
  title: string;
  shortDescription: string;
  categories: string[];
  iconName: string;
  skills: CareerSkill[];
  typicalRoles: string[];
  salaryInsight?: string;
}

export interface SkillGapAnalysis {
  career: Career;
  currentSkills: string[];
  alreadyHave: CareerSkill[];
  needToLearn: CareerSkill[];
  improve: CareerSkill[];
  readinessScore: number;
}

export interface RoadmapItem extends CareerSkill {
  id: string;
  status: SkillStatus;
  userNotes?: string;
  completedAt?: string;
}

export interface RoadmapStage {
  stageNumber: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  items: RoadmapItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  careerGoal?: string;
  experienceLevel?: string;
  joinedAt: string;
}

export interface UserSkillPathState {
  currentView: 'landing' | 'career-select' | 'skills-setup' | 'skill-gap' | 'roadmap' | 'dashboard' | 'progress-track' | 'auth';
  currentUser?: UserProfile | null;
  selectedCareerId: CareerId | null;
  selectedSkills: string[];
  customSkills: string[];
  roadmapItems: RoadmapItem[];
  createdAt: string;
  lastUpdated: string;
}

export interface AiGuidanceResponse {
  mentorSummary: string;
  whyNextSkillMatters: string;
  fastTrackTips: string[];
}
