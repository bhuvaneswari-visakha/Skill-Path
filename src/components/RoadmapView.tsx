import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CircleDot,
  Sparkles,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  HelpCircle,
  ExternalLink,
  Target
} from 'lucide-react';
import { Career, RoadmapItem, SkillStatus } from '../types';
import { groupRoadmapByStages, computeProgressInsights } from '../utils/roadmapGenerator';

interface RoadmapViewProps {
  career: Career;
  items: RoadmapItem[];
  onUpdateStatus: (itemId: string, newStatus: SkillStatus) => void;
  onGoToDashboard: () => void;
  onAdjustSkills: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  career,
  items,
  onUpdateStatus,
  onGoToDashboard,
  onAdjustSkills,
}) => {
  const stages = groupRoadmapByStages(items);
  const insights = computeProgressInsights(items);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(
    insights.currentFocus ? insights.currentFocus.id : null
  );

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'Learning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CircleDot className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Learning</span>
          </span>
        );
      case 'Not Started':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#27272a] text-[#a1a1aa] border border-[#3f3f46]">
            <Clock className="w-3.5 h-3.5 text-[#71717a]" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fafafa]">
      {/* Top Bar Navigation */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-[#a1a1aa]">
        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
          Step 4 of 4 • Learning Roadmap
        </span>
        <button
          onClick={onGoToDashboard}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-xs"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Go to Progress Dashboard</span>
        </button>
      </div>

      {/* Main Roadmap Header */}
      <div className="mb-8">
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
          Personalized Career Roadmap
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          {career.title} Roadmap
        </h1>
        <p className="mt-2 text-sm text-[#a1a1aa]">
          Prioritized sequence tailored to your current skills. Update statuses as you study to track your path to being job-ready.
        </p>
      </div>

      {/* Hero Focus Banner: NEXT RECOMMENDED SKILL (Answers: What should I learn next?) */}
      <div className="mb-10 bg-[#18181b] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>YOUR NEXT STEP • WHAT TO LEARN NEXT</span>
            </div>

            {insights.nextRecommended ? (
              <>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {insights.nextRecommended.name}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Stage 0{insights.nextRecommended.stageNumber}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#a1a1aa] leading-relaxed max-w-2xl">
                  {insights.nextRecommended.whyItMatters}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-blue-300 font-medium">
                  <Target className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    <strong>Recommended Action:</strong> {insights.nextRecommended.recommendedAction}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white">All Roadmap Skills Completed! 🎉</h2>
                <p className="mt-1 text-sm text-[#a1a1aa]">
                  You have marked all skills in this track as completed. Proceed to mock technical interviews and portfolio outreach.
                </p>
              </div>
            )}
          </div>

          {insights.nextRecommended && (
            <div className="shrink-0 flex flex-col gap-2">
              <div className="bg-[#09090b] rounded-xl p-3 border border-[#27272a] text-center">
                <span className="text-[11px] text-[#71717a] block mb-1">Current Status</span>
                {getStatusBadge(insights.nextRecommended.status)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateStatus(insights.nextRecommended!.id, 'Learning')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    insights.nextRecommended.status === 'Learning'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46] hover:text-white'
                  }`}
                >
                  Mark Learning
                </button>
                <button
                  onClick={() => onUpdateStatus(insights.nextRecommended!.id, 'Completed')}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Mark Done ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress Micro-Bar */}
      <div className="mb-10 bg-[#18181b] rounded-2xl border border-[#27272a] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Overall Roadmap Progress</span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {insights.completedCount} / {insights.total} skills completed ({insights.progressPercent}%)
          </div>
        </div>
        <div className="w-full sm:w-80">
          <div className="w-full bg-[#09090b] rounded-full h-3 overflow-hidden border border-[#27272a]">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${insights.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-[#71717a] mt-1.5">
            <span>{insights.learningCount} in progress</span>
            <span>{insights.remainingCount} remaining</span>
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Visual Progression */}
      <div className="space-y-8">
        {stages.map((stage) => {
          const isCurrentActiveStage = stage.stageNumber === insights.activeStageNumber;
          const stageCompletedCount = stage.items.filter((i) => i.status === 'Completed').length;
          const isStageFinished = stage.items.length > 0 && stageCompletedCount === stage.items.length;

          return (
            <div
              key={stage.stageNumber}
              className={`rounded-2xl border transition-all ${
                isCurrentActiveStage
                  ? 'bg-[#18181b] border-blue-500/50 shadow-lg ring-1 ring-blue-500/20'
                  : 'bg-[#18181b] border-[#27272a] shadow-xs'
              }`}
            >
              {/* Stage Header */}
              <div className="p-5 sm:p-6 border-b border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        isStageFinished
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isCurrentActiveStage
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#27272a] text-[#a1a1aa]'
                      }`}
                    >
                      {stage.title}
                    </span>
                    {isCurrentActiveStage && !isStageFinished && (
                      <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        ★ Current Active Stage
                      </span>
                    )}
                    {isStageFinished && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        ✓ All Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1.5">{stage.subtitle}</p>
                </div>

                <div className="text-xs font-semibold text-[#a1a1aa]">
                  {stageCompletedCount} of {stage.items.length} completed
                </div>
              </div>

              {/* Items in Stage */}
              <div className="divide-y divide-[#27272a]">
                {stage.items.map((item) => {
                  const isExpanded = expandedItemId === item.id;
                  const isNextFocus = insights.nextRecommended?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 transition-colors ${
                        isNextFocus
                          ? 'bg-blue-600/10'
                          : item.status === 'Completed'
                          ? 'bg-[#09090b]/30'
                          : 'hover:bg-[#27272a]/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Title & Priority */}
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base font-bold text-[#fafafa]">
                              {item.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                item.priority === 'Essential'
                                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                  : 'bg-[#27272a] text-[#a1a1aa]'
                              }`}
                            >
                              {item.priority}
                            </span>
                            {isNextFocus && (
                              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                                Recommended Next
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-1">
                            {item.whyItMatters}
                          </p>
                        </div>

                        {/* Interactive Status Switcher */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Status Dropdown/Toggle */}
                          <div className="flex items-center bg-[#09090b] p-1 rounded-xl border border-[#27272a] text-xs">
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(item.id, 'Not Started')}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
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
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
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
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                                item.status === 'Completed'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-[#71717a] hover:text-emerald-400'
                              }`}
                            >
                              Completed ✓
                            </button>
                          </div>

                          {/* Accordion toggle */}
                          <button
                            type="button"
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className="p-2 text-[#71717a] hover:text-[#fafafa] rounded-lg"
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

                      {/* Expandable Deep Dive */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[#27272a] text-xs text-[#a1a1aa] bg-[#09090b] rounded-xl p-4 border border-[#27272a]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="font-bold text-white block mb-1">
                                Why It Matters for {career.title}:
                              </span>
                              <p className="leading-relaxed">{item.whyItMatters}</p>
                            </div>
                            <div>
                              <span className="font-bold text-blue-400 block mb-1">
                                Recommended Action & Project Milestone:
                              </span>
                              <p className="leading-relaxed text-blue-300 font-medium">
                                {item.recommendedAction}
                              </p>
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

      {/* Footer Navigation */}
      <div className="mt-12 pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onAdjustSkills}
          className="text-sm font-semibold text-[#a1a1aa] hover:text-white"
        >
          ← Adjust My Skill Gap
        </button>

        <button
          id="roadmap-dashboard-cta"
          onClick={onGoToDashboard}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
        >
          <span>View Progress Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
