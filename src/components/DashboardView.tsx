import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  Award,
  BookOpen,
  Check,
  Copy,
  LineChart,
  FolderGit2,
  Flame,
  ChevronRight
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
  onGoToProgressTrack: () => void;
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
  onGoToProgressTrack,
}) => {
  const insights = computeProgressInsights(roadmapItems);
  const stages = groupRoadmapByStages(roadmapItems);

  // AI Guidance state
  const [aiAdvice, setAiAdvice] = useState<AiGuidanceResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

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
    const text = `🎯 My SkillPath Dashboard for ${career.title}:
Readiness Score: ${readinessScore}%
Progress: ${insights.completedCount}/${insights.total} skills completed (${insights.progressPercent}%)
Current Focus: ${insights.currentFocus ? insights.currentFocus.name : 'All completed!'}
Next Up: ${insights.nextUp ? insights.nextUp.name : 'Portfolio & Job Applications'}
Built with SkillPath: Student to Job-Ready.`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fafafa]"
    >
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#27272a] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Career Dashboard
            </span>
            <span className="text-xs text-[#71717a]">• Live Command Center</span>
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
            id="dash-share-summary-btn"
            onClick={handleShareSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#18181b] text-[#fafafa] border border-[#27272a] hover:bg-[#27272a] transition-colors shadow-xs"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />}
            <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Summary'}</span>
          </button>

          <button
            id="dash-edit-skills-btn"
            onClick={onEditSkills}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#18181b] text-[#fafafa] border border-[#27272a] hover:bg-[#27272a] transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Edit Skills</span>
          </button>

          <button
            id="dash-switch-career-btn"
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
              Job Readiness Score
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                {readinessScore}%
              </span>
              <span className="text-sm font-bold text-blue-400">
                {readinessScore >= 75 ? 'Interview Ready' : readinessScore >= 45 ? 'Job Candidate' : 'Foundations Stage'}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#a1a1aa] leading-relaxed">
              Calculated from required core skills covered. Updates as you complete milestones.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#a1a1aa]">
            <span>Active Stage Focus</span>
            <span className="text-blue-400 font-bold">
              {stages[insights.activeStageNumber - 1]?.title.split(' ')[1] || 'Foundations'}
            </span>
          </div>
        </div>

        {/* 2. Current Focus Card */}
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
              Next Up in Queue
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
                <h3 className="text-xl font-bold text-[#fafafa] mt-2">Queue Finished</h3>
                <p className="mt-1 text-xs text-[#a1a1aa]">
                  Focus on your capstone portfolio and mock interviews!
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#27272a] flex items-center justify-between text-xs text-[#a1a1aa] font-medium">
            <span>Roadmap Completion:</span>
            <span className="font-bold text-white">
              {insights.completedCount} / {insights.total} skills
            </span>
          </div>
        </div>
      </div>

      {/* Progress Track Spotlight Banner (Direct Navigation to Dedicated Progress Track Page) */}
      <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-[#18181b] to-emerald-950/30 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400">
            <LineChart className="w-4 h-4" />
            <span>Dedicated Progress Track Workspace</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            {insights.completedCount} of {insights.total} skills completed ({insights.progressPercent}%)
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Access granular stage-by-stage checklists, verify milestones, log study hours, and track interview benchmarks.
          </p>
        </div>

        <button
          id="dash-open-progress-track-cta"
          onClick={onGoToProgressTrack}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/25 shrink-0"
        >
          <span>Open Full Progress Track</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Career Mentor Guidance Card */}
      <div className="mb-10 bg-[#18181b] border border-blue-500/30 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              AI Career Mentor Insights
            </h3>
            <span className="text-xs text-[#a1a1aa]">Personalized strategic coaching for {career.title} candidates</span>
          </div>
        </div>

        {isLoadingAi ? (
          <div className="py-4 text-xs text-[#a1a1aa] flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing career priorities...</span>
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

      {/* Stage High-Level Overview Grid (Stage 1 to 4) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Stage Overview</h3>
            <p className="text-xs text-[#a1a1aa]">High-level snapshot of your 4-stage journey</p>
          </div>
          <button
            onClick={onGoToProgressTrack}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
          >
            <span>View All Tasks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const completedInStage = stage.items.filter((i) => i.status === 'Completed').length;
            const totalInStage = stage.items.length;
            const pct = totalInStage > 0 ? Math.round((completedInStage / totalInStage) * 100) : 0;
            const isDone = pct === 100 && totalInStage > 0;
            const isCurrent = stage.stageNumber === insights.activeStageNumber && !isDone;

            return (
              <div
                key={stage.stageNumber}
                onClick={onGoToProgressTrack}
                className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  isCurrent
                    ? 'bg-[#18181b] border-blue-500/50 shadow-md ring-1 ring-blue-500/20'
                    : isDone
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : 'bg-[#18181b] border-[#27272a]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#27272a] text-white">
                    Stage 0{stage.stageNumber}
                  </span>
                  <span className={`text-xs font-bold ${isDone ? 'text-emerald-400' : 'text-[#a1a1aa]'}`}>
                    {pct}%
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1 truncate">
                  {stage.title.split(': ')[1] || stage.title}
                </h4>
                <p className="text-xs text-[#a1a1aa] mt-0.5 line-clamp-1">{stage.subtitle}</p>

                <div className="mt-3 w-full bg-[#09090b] rounded-full h-1.5 overflow-hidden border border-[#27272a]">
                  <div
                    className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-2 text-[11px] text-[#71717a] font-medium">
                  {completedInStage} / {totalInStage} completed
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Capstone Projects & Practical Portfolio Work */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <FolderGit2 className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-white">
              Recommended Capstone Projects for {career.title}
            </h3>
            <span className="text-xs text-[#a1a1aa]">
              Hiring managers prioritize candidates who have built and deployed real systems.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Primary Capstone</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                High Impact
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-2">
              Full-Lifecycle {career.title} Portfolio Project
            </h4>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              Build and deploy an application solving an authentic real-world problem using your Stage 02 and 03 stack. Ensure clean Git commits, README setup, and live demo URL.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Interview Proof</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Portfolio Ready
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-2">
              System Architecture & Problem Breakdown
            </h4>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              Document architectural trade-offs, edge-case handling, and database schemas. Be ready to explain these decisions in technical interviews.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
