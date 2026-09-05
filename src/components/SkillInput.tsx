import React, { useState, useMemo } from 'react';
import { Search, Plus, X, ArrowRight, ArrowLeft, Check, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { COMMON_SKILL_GROUPS, ALL_KNOWN_SKILLS, normalizeSkillName } from '../data/commonSkills';
import { Career } from '../types';

interface SkillInputProps {
  career: Career;
  selectedSkills: string[];
  onToggleSkill: (skillName: string) => void;
  onAddCustomSkill: (skillName: string) => void;
  onRemoveSkill: (skillName: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SkillInput: React.FC<SkillInputProps> = ({
  career,
  selectedSkills,
  onToggleSkill,
  onAddCustomSkill,
  onRemoveSkill,
  onNext,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Quick recommend skills that are directly relevant to the selected career
  const careerRequiredSkillNames = useMemo(() => {
    return career.skills.map((s) => s.name);
  }, [career]);

  // Filter skills based on search
  const filteredCatalogSkills = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const q = searchQuery.toLowerCase();
    return ALL_KNOWN_SKILLS.filter((s) => s.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;

    // Check if already selected
    const alreadySelected = selectedSkills.some(
      (s) => normalizeSkillName(s) === normalizeSkillName(trimmed)
    );

    if (alreadySelected) {
      setValidationWarning(`"${trimmed}" is already in your selected skills list.`);
      return;
    }

    onAddCustomSkill(trimmed);
    setCustomInput('');
    setValidationWarning(null);
  };

  const handleAnalyze = () => {
    if (selectedSkills.length === 0) {
      setValidationWarning(
        'Please select at least one skill you know, or click "Start as Complete Beginner" below to see the full beginner path.'
      );
      return;
    }
    setValidationWarning(null);
    onNext();
  };

  const handleBeginnerProceed = () => {
    // Proceed with 0 skills - pure beginner roadmap
    setValidationWarning(null);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fafafa]">
      {/* Header & Step Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-[#a1a1aa]">
        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
          Step 2 of 4
        </span>
        <span className="text-[#a1a1aa]">Target Role: <strong className="text-white">{career.title}</strong></span>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What skills do you already have?
        </h1>
        <p className="mt-3 text-base text-[#a1a1aa]">
          Select the technologies, languages, or tools you have worked with. SkillPath will analyze what you already have vs. what you still need.
        </p>
      </div>

      {/* Selected Skills Chips Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-[#18181b] border border-[#27272a] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
              Your Selected Skills
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {selectedSkills.length}
            </span>
          </div>
          {selectedSkills.length > 0 && (
            <button
              onClick={() => {
                selectedSkills.forEach((s) => onRemoveSkill(s));
              }}
              className="text-xs font-semibold text-[#71717a] hover:text-rose-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {selectedSkills.length === 0 ? (
          <div className="py-6 text-center border-2 border-dashed border-[#27272a] rounded-xl">
            <p className="text-sm font-medium text-[#a1a1aa]">
              No skills selected yet. Click any skill chip below or search to add them.
            </p>
            <p className="text-xs text-[#71717a] mt-1">
              If you are starting from zero, you can still proceed as a complete beginner.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 animate-in fade-in zoom-in-95 duration-150"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="p-0.5 rounded hover:bg-blue-500/20 text-blue-400 hover:text-white transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Validation Alert */}
      {validationWarning && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{validationWarning}</span>
          </div>
          <button
            onClick={() => setValidationWarning(null)}
            className="text-amber-400 hover:text-amber-200 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Custom Add Input */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search existing database */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input
            id="skill-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill (e.g. Python, SQL, React)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#27272a] bg-[#18181b] text-sm text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        {/* Add custom skill input */}
        <form onSubmit={handleAddCustom} className="flex gap-2">
          <input
            id="skill-custom-input"
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom skill (e.g. Kotlin, Supabase)..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#27272a] bg-[#18181b] text-sm text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-[#27272a] disabled:text-[#71717a] text-white text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Search Autocomplete Results */}
      {searchQuery.trim() && (
        <div className="mb-8 p-4 rounded-xl bg-[#18181b] border border-[#27272a]">
          <span className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider block mb-2">
            Matching Catalog Skills:
          </span>
          {filteredCatalogSkills.length === 0 ? (
            <p className="text-xs text-[#71717a]">
              No matching skill in standard catalog. You can type it into the "Add custom skill" box above!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredCatalogSkills.map((skill) => {
                const isSelected = selectedSkills.some((s) => normalizeSkillName(s) === normalizeSkillName(skill));
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      onToggleSkill(skill);
                      setValidationWarning(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#27272a] text-[#fafafa] border border-[#3f3f46] hover:border-blue-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recommended Role Skills (Quick Click) */}
      <div className="mb-8 p-5 rounded-2xl bg-[#18181b] border border-blue-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">
            Skills frequently required for {career.title}:
          </h3>
        </div>
        <p className="text-xs text-[#a1a1aa] mb-3">
          Click any skill you have touched or studied:
        </p>
        <div className="flex flex-wrap gap-2">
          {careerRequiredSkillNames.map((skillName) => {
            const isSelected = selectedSkills.some(
              (s) => normalizeSkillName(s) === normalizeSkillName(skillName)
            );
            return (
              <button
                key={skillName}
                type="button"
                onClick={() => {
                  onToggleSkill(skillName);
                  setValidationWarning(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-[#27272a] text-[#fafafa] border border-[#3f3f46] hover:border-blue-500/50 hover:bg-[#3f3f46]'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-[#a1a1aa]" />}
                <span>{skillName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Skill Groups Catalog */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
          Browse by Technology Domain:
        </h3>

        {COMMON_SKILL_GROUPS.map((group) => (
          <div key={group.groupName} className="p-4 rounded-xl bg-[#18181b] border border-[#27272a]">
            <h4 className="text-xs font-bold text-[#fafafa] mb-2.5">{group.groupName}</h4>
            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => {
                const isSelected = selectedSkills.some(
                  (s) => normalizeSkillName(s) === normalizeSkillName(skill)
                );
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      onToggleSkill(skill);
                      setValidationWarning(null);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-[#27272a] text-[#fafafa] hover:bg-[#3f3f46] border border-[#3f3f46]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-12 pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Selection</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {selectedSkills.length === 0 && (
            <button
              type="button"
              onClick={handleBeginnerProceed}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 py-2"
            >
              Start as Complete Beginner (0 skills)
            </button>
          )}

          <button
            id="skill-analyze-cta"
            onClick={handleAnalyze}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
          >
            <span>Analyze My Skills</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
