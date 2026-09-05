import { Career, CareerSkill, RoadmapItem, RoadmapStage, SkillGapAnalysis, SkillStatus } from '../types';
import { matchSkill } from '../data/commonSkills';

/**
 * Analyzes the gap between a user's known skills and a target career's requirements.
 */
export function analyzeSkillGap(career: Career, userSkills: string[]): SkillGapAnalysis {
  const alreadyHave: CareerSkill[] = [];
  const needToLearn: CareerSkill[] = [];
  const improve: CareerSkill[] = [];

  career.skills.forEach((reqSkill) => {
    const isKnown = userSkills.some((userSkill) => matchSkill(userSkill, reqSkill.name));

    if (isKnown) {
      alreadyHave.push(reqSkill);
      // If it is an essential foundation skill in stage 1, or marked high priority, suggest it as an "Improve" item too
      // so the user knows they can sharpen it to production caliber
      if (reqSkill.stageNumber === 1 || reqSkill.priority === 'Essential') {
        improve.push(reqSkill);
      }
    } else {
      needToLearn.push(reqSkill);
    }
  });

  // Calculate approximate Career Readiness Score
  // Weighted: Essential skills = 1.2, High = 1.0, Recommended = 0.8
  let totalWeight = 0;
  let earnedWeight = 0;

  career.skills.forEach((skill) => {
    const weight = skill.priority === 'Essential' ? 1.2 : skill.priority === 'High' ? 1.0 : 0.8;
    totalWeight += weight;

    const hasSkill = userSkills.some((s) => matchSkill(s, skill.name));
    if (hasSkill) {
      earnedWeight += weight;
    }
  });

  const rawScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  // Bound score between 0 and 100
  const readinessScore = Math.max(0, Math.min(100, rawScore));

  return {
    career,
    currentSkills: userSkills,
    alreadyHave,
    needToLearn,
    improve,
    readinessScore,
  };
}

/**
 * Generates initial roadmap items. If user already has a skill, it defaults to 'Completed'.
 * The first missing skill in early stages is queued or can be set to 'Learning'.
 */
export function generateInitialRoadmap(career: Career, userSkills: string[]): RoadmapItem[] {
  let firstMissingIdentified = false;

  return career.skills.map((skill, index) => {
    const hasSkill = userSkills.some((s) => matchSkill(s, skill.name));

    let status: SkillStatus = 'Not Started';
    if (hasSkill) {
      status = 'Completed';
    } else if (!firstMissingIdentified) {
      // Mark the immediate next skill as "Learning" to jumpstart their journey
      status = 'Learning';
      firstMissingIdentified = true;
    }

    return {
      ...skill,
      id: `${career.id}-skill-${index}-${skill.name.toLowerCase().replace(/\s+/g, '-')}`,
      status,
      completedAt: hasSkill ? new Date().toISOString() : undefined,
    };
  });
}

/**
 * Groups roadmap items into 4 structured stages.
 */
export function groupRoadmapByStages(items: RoadmapItem[]): RoadmapStage[] {
  const stageDefinitions = [
    {
      stageNumber: 1 as const,
      title: '01 Foundations',
      subtitle: 'Core concepts, fundamental syntax & essential setup',
    },
    {
      stageNumber: 2 as const,
      title: '02 Core Skills & Tools',
      subtitle: 'Industry-standard frameworks, libraries & daily workflows',
    },
    {
      stageNumber: 3 as const,
      title: '03 Applied Systems & Advanced Skills',
      subtitle: 'Production best practices, architectures & optimization',
    },
    {
      stageNumber: 4 as const,
      title: '04 Capstone & Portfolio',
      subtitle: 'Real-world projects, GitHub showcase & interview prep',
    },
  ];

  return stageDefinitions.map((def) => {
    const stageItems = items.filter((item) => item.stageNumber === def.stageNumber);
    return {
      ...def,
      items: stageItems,
    };
  });
}

/**
 * Identifies:
 * - Next recommended skill
 * - Current focus skill
 * - Next up skill
 * - Progress stats
 */
export function computeProgressInsights(items: RoadmapItem[]) {
  const total = items.length;
  const completedCount = items.filter((i) => i.status === 'Completed').length;
  const learningItems = items.filter((i) => i.status === 'Learning');
  const notStartedItems = items.filter((i) => i.status === 'Not Started');

  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // The skill currently being learned, or the very first incomplete skill
  const currentFocus = learningItems[0] || notStartedItems[0] || null;

  // The next skill up after current focus
  let nextUp: RoadmapItem | null = null;
  if (learningItems.length > 1) {
    nextUp = learningItems[1];
  } else if (learningItems.length === 1 && notStartedItems.length > 0) {
    nextUp = notStartedItems[0];
  } else if (notStartedItems.length > 1) {
    nextUp = notStartedItems[1];
  }

  // Next recommended skill:
  const nextRecommended = currentFocus || (items.length > 0 ? items[0] : null);

  // Determine current active stage
  let activeStageNumber: 1 | 2 | 3 | 4 = 1;
  if (currentFocus) {
    activeStageNumber = currentFocus.stageNumber;
  } else if (completedCount === total && total > 0) {
    activeStageNumber = 4;
  }

  return {
    total,
    completedCount,
    learningCount: learningItems.length,
    remainingCount: notStartedItems.length,
    progressPercent,
    currentFocus,
    nextUp,
    nextRecommended,
    activeStageNumber,
  };
}
