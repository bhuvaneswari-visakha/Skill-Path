import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, Check, BarChart3, Globe, Cpu, Cloud, Server, Code2, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { CAREERS } from '../data/careers';
import { Career, CareerId } from '../types';

interface CareerSelectProps {
  selectedCareerId: CareerId | null;
  onSelectCareer: (careerId: CareerId) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CareerSelect: React.FC<CareerSelectProps> = ({
  selectedCareerId,
  onSelectCareer,
  onNext,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Icon mapping
  const renderCareerIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'BarChart3':
        return <BarChart3 {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Cloud':
        return <Cloud {...props} />;
      case 'Server':
        return <Server {...props} />;
      case 'Code2':
        return <Code2 {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  // Filter categories
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    CAREERS.forEach((c) => c.categories.forEach((cat) => set.add(cat)));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered careers
  const filteredCareers = useMemo(() => {
    return CAREERS.filter((career) => {
      const matchesSearch =
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || career.categories.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleContinue = () => {
    if (!selectedCareerId) {
      setValidationError('Please select a career goal to continue.');
      return;
    }
    setValidationError(null);
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fafafa]">
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-[#a1a1aa]">
        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
          Step 1 of 4
        </span>
        <span className="text-[#a1a1aa]">Choose Your Target Career</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Where do you want your career to go?
        </h1>
        <p className="mt-3 text-base text-[#a1a1aa]">
          Select the career track you are targeting. SkillPath will benchmark your current skills against industry requirements for this role.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input
            id="career-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role title or skill (e.g., Python, Cloud, Data, React)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#27272a] bg-[#18181b] text-sm text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
          />
        </div>

        {/* Category selector */}
        <div className="sm:w-64">
          <select
            id="career-category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-3 px-3 rounded-xl border border-[#27272a] bg-[#18181b] text-sm text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#18181b] text-[#fafafa]">
                {cat === 'All' ? 'All Domains' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium flex items-center justify-between">
          <span>{validationError}</span>
          <button
            onClick={() => setValidationError(null)}
            className="text-amber-400 hover:text-amber-200 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Career Cards Grid */}
      {filteredCareers.length === 0 ? (
        <div className="text-center py-16 bg-[#18181b] rounded-2xl border border-[#27272a] p-8">
          <p className="text-base font-semibold text-[#fafafa]">No careers match your search query.</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Try clearing filters or search for another keyword.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold hover:bg-blue-500/20"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => {
            const isSelected = selectedCareerId === career.id;

            return (
              <div
                key={career.id}
                onClick={() => {
                  onSelectCareer(career.id);
                  setValidationError(null);
                }}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#18181b] border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30'
                    : 'bg-[#18181b] border-[#27272a] hover:border-blue-500/40 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top row: Icon & Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#27272a] text-[#a1a1aa] group-hover:text-blue-400'
                      }`}
                    >
                      {renderCareerIcon(career.iconName)}
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Career Title & Description */}
                  <h3 className="text-xl font-bold text-[#fafafa] tracking-tight">
                    {career.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#a1a1aa] leading-relaxed">
                    {career.shortDescription}
                  </p>

                  {/* Required Skills summary */}
                  <div className="mt-4 pt-4 border-t border-[#27272a]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block mb-2">
                      Key Skills ({career.skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill.name}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#27272a] text-[#fafafa] border border-[#3f3f46]"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {career.skills.length > 5 && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#27272a] text-[#a1a1aa] border border-dashed border-[#3f3f46]">
                          +{career.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Select Button */}
                <div className="mt-6 pt-4 border-t border-[#27272a] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#a1a1aa]">
                    {career.typicalRoles[0]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCareer(career.id);
                      setValidationError(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#27272a] text-[#fafafa] hover:bg-[#3f3f46]'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Career'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="mt-12 pt-6 border-t border-[#27272a] flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors"
        >
          Back to Overview
        </button>

        <button
          id="career-continue-btn"
          onClick={handleContinue}
          disabled={!selectedCareerId}
          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${
            selectedCareerId
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95'
              : 'bg-[#27272a] text-[#71717a] cursor-not-allowed'
          }`}
        >
          <span>Next: Enter Current Skills</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
