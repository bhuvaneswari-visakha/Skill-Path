export interface SkillCatalogGroup {
  groupName: string;
  skills: string[];
}

export const COMMON_SKILL_GROUPS: SkillCatalogGroup[] = [
  {
    groupName: 'Programming Languages',
    skills: ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript', 'C#', 'Go', 'PHP', 'R', 'Ruby'],
  },
  {
    groupName: 'Web & Frontend',
    skills: ['HTML', 'CSS', 'React', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Bootstrap', 'Responsive Design'],
  },
  {
    groupName: 'Data & Analytics',
    skills: ['SQL', 'Excel', 'Pandas', 'NumPy', 'Power BI', 'Tableau', 'Statistics', 'Data Visualization', 'Scikit-Learn'],
  },
  {
    groupName: 'AI & Machine Learning',
    skills: ['Machine Learning', 'LLMs', 'RAG', 'PyTorch', 'TensorFlow', 'APIs', 'Prompt Engineering', 'NLP'],
  },
  {
    groupName: 'Cloud & DevOps',
    skills: ['Git', 'Docker', 'Linux', 'Networking', 'Cloud fundamentals', 'CI/CD', 'AWS', 'Kubernetes', 'Terraform'],
  },
  {
    groupName: 'Backend & Systems',
    skills: ['REST APIs', 'Node.js', 'Database Design', 'Authentication & Security', 'Redis', 'PostgreSQL', 'MongoDB'],
  },
  {
    groupName: 'Engineering & Security',
    skills: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Unit Testing', 'Wireshark', 'Vulnerability Scanning', 'Incident Response'],
  },
];

// Flat list of unique popular skills
export const ALL_KNOWN_SKILLS: string[] = Array.from(
  new Set(COMMON_SKILL_GROUPS.flatMap((g) => g.skills))
).sort();

export function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase();
}

export function matchSkill(skillA: string, skillB: string): boolean {
  const a = normalizeSkillName(skillA);
  const b = normalizeSkillName(skillB);
  if (a === b) return true;
  // Handle common synonyms
  if ((a === 'js' && b === 'javascript') || (a === 'javascript' && b === 'js')) return true;
  if ((a === 'ts' && b === 'typescript') || (a === 'typescript' && b === 'ts')) return true;
  if ((a === 'py' && b === 'python') || (a === 'python' && b === 'py')) return true;
  if ((a === 'postgres' && b === 'postgresql') || (a === 'postgresql' && b === 'postgres')) return true;
  if ((a === 'powerbi' && b === 'power bi') || (a === 'power bi' && b === 'powerbi')) return true;
  return false;
}
