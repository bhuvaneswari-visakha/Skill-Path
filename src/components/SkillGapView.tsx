import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, TrendingUp, Info, Zap, RefreshCw } from 'lucide-react';
import { SkillGapAnalysis } from '../types';

interface SkillGapViewProps {
  analysis: SkillGapAnalysis;
  onGenerateRoadmap: () => void;
  onEditSkills: () => void;
  onChangeCareer: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  analysis,
  onGenerateRoadmap,
  onEditSkills,
  onChangeCareer,
}) => {
  const { career, alreadyHave, needToLearn, improve, readinessScore } = analysis;

  // Determine readiness tier styling
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 40) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getScoreFeedback = (score: number) => {
    if (score >= 80) return 'Outstanding foundation. You are close to being interview-ready with focused project polish.';
    if (score >= 60) return 'Solid foundation. You have key prerequisites; focusing on the core gaps will make you competitive.';
    if (score >= 35) return 'Promising start. You know some foundational tools; following a structured roadmap will accelerate your progress.';
    return 'Early stage. Starting from scratch gives you the clean slate to learn modern industry tools in the right order.';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fafafa]">
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-[#a1a1aa]">
        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
          Step 3 of 4
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onChangeCareer}
            className="text-[#a1a1aa] hover:text-white transition-colors"
          >
            Change Career
          </button>
          <span className="text-[#3f3f46]">•</span>
          <button
            onClick={onEditSkills}
            className="text-[#a1a1aa] hover:text-white transition-colors"
          >
            Edit Skills
          </button>
        </div>
      </div>

      {/* Main Title & Career Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1 block">
          Skill Gap Analysis
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Your Skill Gap for <span className="text-blue-400">{career.title}</span>
        </h1>
        <p className="mt-2 text-sm text-[#a1a1aa]">
          We analyzed your current skills against the requirements expected by employers for this role.
        </p>
      </div>

      {/* Hero Score Metric Card */}
      <div className="mb-10 bg-[#18181b] rounded-2xl border border-[#27272a] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              Career Readiness Indicator
            </span>
            <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-3">
              <span className="text-5xl font-black text-white tracking-tight">
                {readinessScore}%
              </span>
              <span className="text-lg font-bold text-[#a1a1aa]">
                Career Ready
              </span>
            </div>
            <p className="mt-3 text-sm text-[#a1a1aa] leading-relaxed max-w-xl">
              {getScoreFeedback(readinessScore)}
            </p>
          </div>

          {/* Graphical gauge / pill */}
          <div className="w-full sm:w-72 bg-[#09090b] border border-[#27272a] rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-[#a1a1aa] mb-2 flex justify-between">
              <span>Readiness Progress</span>
              <span className="text-[#fafafa] font-mono">{readinessScore} / 100</span>
            </div>
            <div className="w-full bg-[#27272a] rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(6, readinessScore)}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#71717a] font-medium">
              <Info className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
              <span>Guidance indicator, not scientific exam</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Classifications: Already Have | Need to Learn | Improve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* 1. Already Have */}
        <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#fafafa]">Already Have</h3>
                  <span className="text-xs text-[#a1a1aa]">Skills you already know</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {alreadyHave.length}
              </span>
            </div>

            {alreadyHave.length === 0 ? (
              <div className="py-8 text-center bg-[#09090b] rounded-xl border border-dashed border-[#27272a]">
                <p className="text-xs font-medium text-[#a1a1aa]">None yet for this role.</p>
                <p className="text-[11px] text-[#71717a] mt-0.5">Everything you learn will be brand new value.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {alreadyHave.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3 rounded-xl bg-[#09090b] border border-emerald-500/20 flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {skill.name}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        Stage 0{skill.stageNumber} • {skill.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 shrink-0">✓ Covered</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 pt-4 border-t border-[#27272a] text-[11px] text-[#71717a]">
            Great work! These foundational skills count toward your starting readiness.
          </p>
        </div>

        {/* 2. Need to Learn */}
        <div className="bg-[#18181b] rounded-2xl border-2 border-blue-500/40 p-6 flex flex-col justify-between shadow-xs ring-1 ring-blue-500/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Need to Learn</h3>
                  <span className="text-xs text-[#a1a1aa]">Important missing skills</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {needToLearn.length}
              </span>
            </div>

            {needToLearn.length === 0 ? (
              <div className="py-8 text-center bg-[#09090b] rounded-xl border border-emerald-500/30">
                <p className="text-xs font-bold text-emerald-400">All required skills covered!</p>
                <p className="text-[11px] text-[#a1a1aa] mt-0.5">Proceed to project and portfolio polish.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {needToLearn.map((skill, idx) => (
                  <div
                    key={skill.name}
                    className={`p-3 rounded-xl border transition-all ${
                      idx === 0
                        ? 'bg-gradient-to-r from-blue-600/20 to-[#09090b] border-blue-500/40 ring-1 ring-blue-500/30'
                        : 'bg-[#09090b] border-[#27272a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#fafafa]">
                        {skill.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          skill.priority === 'Essential'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {skill.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] mt-1 line-clamp-2">
                      {skill.whyItMatters}
                    </p>
                    {idx === 0 && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        ★ Next Recommended Focus
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 pt-4 border-t border-[#27272a] text-[11px] text-blue-400 font-medium">
            Your personalized roadmap will organize these skills into logical stages.
          </p>
        </div>

        {/* 3. Improve */}
        <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#fafafa]">Improve</h3>
                  <span className="text-xs text-[#a1a1aa]">Strengthen to production depth</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {improve.length}
              </span>
            </div>

            {improve.length === 0 ? (
              <div className="py-8 text-center bg-[#09090b] rounded-xl border border-dashed border-[#27272a]">
                <p className="text-xs font-medium text-[#a1a1aa]">No overlap yet to strengthen.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {improve.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3 rounded-xl bg-[#09090b] border border-amber-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#fafafa]">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Deepen
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] mt-1">
                      {skill.recommendedAction}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 pt-4 border-t border-[#27272a] text-[11px] text-[#71717a]">
            Interviewers test for real problem-solving, not just syntax familiarity.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onEditSkills}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Adjust Selected Skills</span>
        </button>

        <button
          id="generate-roadmap-btn"
          onClick={onGenerateRoadmap}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
        >
          <span>Generate My Roadmap</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
