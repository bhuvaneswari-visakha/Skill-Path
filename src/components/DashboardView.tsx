import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  CircleDot,
  Clock,
  ArrowRight,
  TrendingUp,
  Share2,
  RotateCcw,
  Edit3,
  Compass,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Check,
  Copy
} from 'lucide-react';
import { Career, RoadmapItem, SkillStatus, AiGuidanceResponse } from '../types';
import { computeProgressInsights, groupRoadmapByStages } from '../utils/roadmapGenerator';

interface DashboardViewProps {
  career: Career;
  roadmapItems: RoadmapItem[];
  userSkills: string[];
  readinessScore: number;
  onUpdateStatus: (itemId: string, newStatus: SkillStatus) => void;
  onEditSkills: () => void;
  onChangeCareer: () => void;
  onReset: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  career,
  roadmapItems,
  userSkills,
  readinessScore,
  onUpdateStatus,
  onEditSkills,
  onChangeCareer,
  onReset,
}) => {
  const insights = computeProgressInsights(roadmapItems);
  const stages = groupRoadmapByStages(roadmapItems);

  // AI Guidance state
  const [aiAdvice, setAiAdvice] = useState<AiGuidanceResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Load AI Career Mentor recommendations on mount or when career / current focus changes
  useEffect(() => {
    let isMounted = true;
    const fetchAiGuidance = async () => {
      setIsLoadingAi(true);
      try {
        const missingSkills = roadmapItems
          .filter((i) => i.status !== 'Completed')
          .map((i) => i.name)
          .slice(0, 5);

        const res = await fetch('/api/ai/guidance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            careerTitle: career.title,
            currentSkills: userSkills,
            missingSkills,
            nextSkill: insights.currentFocus?.name,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (isMounted && json?.data) {
            setAiAdvice(json.data);
          }
        }
      } catch (err) {
        console.warn('AI Mentor guidance fallback active:', err);
      } finally {
        if (isMounted) setIsLoadingAi(false);
      }
    };

    fetchAiGuidance();
    return () => {
      isMounted = false;
    };
  }, [career.id, insights.currentFocus?.name]);

  const handleShareSummary = () => {
    const text = `🎯 My SkillPath Progress for ${career.title}:
Readiness Score: ${readinessScore}%
Progress: ${insights.completedCount}/${insights.total} skills completed (${insights.progressPercent}%)
Current Focus: ${insights.currentFocus ? insights.currentFocus.name : 'All completed!'}
Next Up: ${insights.nextUp ? insights.nextUp.name : 'Portfolio & Job Applications'}
Built with SkillPath: Know what to learn. Know what comes next.`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fafafa]">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#27272a] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Active SkillPath
            </span>
            <span className="text-xs text-[#71717a]">• Updated live</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {career.title}
          </h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">
            {career.shortDescription}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleShareSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#18181b] text-[#fafafa] border border-[#27272a] hover:bg-[#27272a] transition-colors shadow-xs"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />}
            <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Progress'}</span>
          </button>

          <button
            onClick={onEditSkills}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#18181b] text-[#fafafa] border border-[#27272a] hover:bg-[#27272a] transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Edit Skills</span>
          </button>

          <button
            onClick={onChangeCareer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#18181b] text-[#fafafa] border border-[#27272a] hover:bg-[#27272a] transition-colors shadow-xs"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Switch Career</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Grid: Where am I? What have I completed? What should I learn next? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* 1. Career Readiness Card */}
        <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
              Guidance Score
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                {readinessScore}%
              </span>
              <span className="text-sm font-bold text-blue-400">
                Career Ready
              </span>
            </div>
            <p className="mt-2 text-xs text-[#a1a1aa] leading-relaxed">
              Based on required core skills covered. Updates dynamically as you complete roadmap items.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#a1a1aa]">
            <span>Stage 0{insights.activeStageNumber} Focus</span>
            <span className="text-blue-400 font-bold">
              {stages[insights.activeStageNumber - 1]?.title.split(' ')[1] || 'Foundations'}
            </span>
          </div>
        </div>

        {/* 2. Current Focus Card (Answers: What should I learn next?) */}
        <div className="bg-gradient-to-br from-blue-950/60 to-[#18181b] text-white rounded-2xl p-6 shadow-md border border-blue-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30">
                Current Focus
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {insights.currentFocus ? (
              <>
                <h3 className="text-2xl font-black text-white mt-1">
                  Learn {insights.currentFocus.name}
                </h3>
                <p className="mt-1 text-xs text-blue-200 leading-relaxed line-clamp-2">
                  {insights.currentFocus.whyItMatters}
                </p>
              </>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white mt-1">All Skills Completed!</h3>
                <p className="mt-1 text-xs text-blue-200">
                  You have finished every milestone in this track.
                </p>
              </div>
            )}
          </div>

          {insights.currentFocus && (
            <div className="mt-4 pt-4 border-t border-blue-500/20 flex items-center justify-between gap-2">
              <span className="text-xs text-blue-300 font-medium">
                Status: {insights.currentFocus.status}
              </span>
              <button
                onClick={() => onUpdateStatus(insights.currentFocus!.id, 'Completed')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs"
              >
                Mark Done ✓
              </button>
            </div>
          )}
        </div>

        {/* 3. Next Up Card */}
        <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider block">
              Next Up
            </span>

            {insights.nextUp ? (
              <>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {insights.nextUp.name}
                </h3>
                <p className="mt-1 text-xs text-[#a1a1aa] line-clamp-2">
                  {insights.nextUp.whyItMatters}
                </p>
              </>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-[#fafafa] mt-2">No Upcoming Queue</h3>
                <p className="mt-1 text-xs text-[#a1a1aa]">
                  Focus on your current milestone or capstone project!
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#27272a] flex items-center justify-between text-xs text-[#a1a1aa] font-medium">
            <span>Overall Completed:</span>
            <span className="font-bold text-white">
              {insights.completedCount} / {insights.total} skills
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="mb-10 bg-[#18181b] border border-[#27272a] text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Your Progress
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {insights.completedCount} / {insights.total} skills completed
            </h2>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {insights.progressPercent}%
          </div>
        </div>

        <div className="w-full bg-[#09090b] rounded-full h-3 overflow-hidden border border-[#27272a]">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(4, insights.progressPercent)}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#a1a1aa] font-medium gap-2">
          <span>✓ {insights.completedCount} Completed</span>
          <span>⚡ {insights.learningCount} Currently Learning</span>
          <span>⏳ {insights.remainingCount} Not Started</span>
        </div>
      </div>

      {/* AI Career Mentor Guidance Card */}
      <div className="mb-12 bg-[#18181b] border border-blue-500/30 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              AI Career Mentor Insights
            </h3>
            <span className="text-xs text-[#a1a1aa]">Strategic direction for {career.title} candidates</span>
          </div>
        </div>

        {isLoadingAi ? (
          <div className="py-4 text-xs text-[#a1a1aa] flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing roadmap priorities...</span>
          </div>
        ) : aiAdvice ? (
          <div className="mt-3 space-y-4 text-xs sm:text-sm">
            <p className="text-[#fafafa] leading-relaxed font-medium bg-[#09090b] p-3.5 rounded-xl border border-[#27272a]">
              "{aiAdvice.mentorSummary}"
            </p>

            {aiAdvice.whyNextSkillMatters && (
              <div className="text-xs text-[#a1a1aa]">
                <strong className="text-white block mb-0.5">Why your current focus matters:</strong>
                {aiAdvice.whyNextSkillMatters}
              </div>
            )}

            {aiAdvice.fastTrackTips && aiAdvice.fastTrackTips.length > 0 && (
              <div>
                <strong className="text-xs uppercase tracking-wider text-[#a1a1aa] block mb-2">
                  Fast-Track Execution Tips:
                </strong>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {aiAdvice.fastTrackTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] text-xs text-[#fafafa] font-medium"
                    >
                      💡 {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Complete Interactive Learning Roadmap */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Complete Learning Roadmap
            </h2>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Click any status button to update your progress. Your changes save automatically.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {stages.map((stage) => {
            const stageCompleted = stage.items.filter((i) => i.status === 'Completed').length;
            const isFinished = stage.items.length > 0 && stageCompleted === stage.items.length;
            const isActiveStage = stage.stageNumber === insights.activeStageNumber;

            return (
              <div
                key={stage.stageNumber}
                className={`rounded-2xl border transition-all ${
                  isActiveStage
                    ? 'bg-[#18181b] border-blue-500/50 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-[#18181b] border-[#27272a]'
                }`}
              >
                {/* Stage Header */}
                <div className="p-4 sm:p-5 border-b border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#27272a] text-white">
                        {stage.title}
                      </span>
                      {isActiveStage && !isFinished && (
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          Current Stage
                        </span>
                      )}
                      {isFinished && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          ✓ Finished
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#a1a1aa] mt-1">{stage.subtitle}</p>
                  </div>

                  <div className="text-xs font-semibold text-[#a1a1aa]">
                    {stageCompleted} / {stage.items.length} completed
                  </div>
                </div>

                {/* Items in Stage */}
                <div className="divide-y divide-[#27272a]">
                  {stage.items.map((item) => {
                    const isExpanded = expandedItemId === item.id;
                    const isCurrentFocus = insights.currentFocus?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 transition-colors ${
                          isCurrentFocus
                            ? 'bg-blue-600/10'
                            : item.status === 'Completed'
                            ? 'bg-[#09090b]/30'
                            : 'hover:bg-[#27272a]/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">
                                {item.name}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  item.priority === 'Essential'
                                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                    : 'bg-[#27272a] text-[#a1a1aa]'
                                }`}
                              >
                                {item.priority}
                              </span>
                              {isCurrentFocus && (
                                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                                  Focus
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#a1a1aa] mt-0.5 line-clamp-1">
                              {item.whyItMatters}
                            </p>
                          </div>

                          {/* Quick status toggle */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center bg-[#09090b] p-1 rounded-xl border border-[#27272a] text-xs">
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(item.id, 'Not Started')}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  item.status === 'Not Started'
                                    ? 'bg-[#27272a] text-white shadow-xs'
                                    : 'text-[#71717a] hover:text-[#fafafa]'
                                }`}
                              >
                                Not Started
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(item.id, 'Learning')}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  item.status === 'Learning'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-[#71717a] hover:text-blue-400'
                                }`}
                              >
                                Learning
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(item.id, 'Completed')}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  item.status === 'Completed'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-[#71717a] hover:text-emerald-400'
                                }`}
                              >
                                Done ✓
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                              className="p-1.5 text-[#71717a] hover:text-[#fafafa] rounded-lg"
                              aria-label="Toggle details"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#27272a] text-xs bg-[#09090b] rounded-xl p-3.5 border border-[#27272a]">
                            <div className="space-y-2">
                              <div>
                                <strong className="text-white block">Why it matters:</strong>
                                <span className="text-[#a1a1aa]">{item.whyItMatters}</span>
                              </div>
                              <div>
                                <strong className="text-blue-400 block">Recommended Action:</strong>
                                <span className="text-blue-300 font-medium">{item.recommendedAction}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger / Reset Area */}
      <div className="mt-16 pt-8 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a] gap-4">
        <span>
          SkillPath data is stored locally in your browser.
        </span>
        <button
          onClick={onReset}
          className="text-rose-400 hover:text-rose-300 font-semibold"
        >
          Reset All Progress & Start Over
        </button>
      </div>
    </div>
  );
};
