import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  CircleDot,
  Clock,
  ArrowRight,
  TrendingUp,
  Share2,
  BookOpen,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  LayoutDashboard,
  Calendar,
  Flame,
  Award,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { Career, RoadmapItem, SkillStatus } from '../types';
import { computeProgressInsights, groupRoadmapByStages } from '../utils/roadmapGenerator';

interface ProgressTrackViewProps {
  career: Career;
  roadmapItems: RoadmapItem[];
  readinessScore: number;
  onUpdateStatus: (itemId: string, newStatus: SkillStatus) => void;
  onGoToDashboard: () => void;
}

export const ProgressTrackView: React.FC<ProgressTrackViewProps> = ({
  career,
  roadmapItems,
  readinessScore,
  onUpdateStatus,
  onGoToDashboard,
}) => {
  const insights = computeProgressInsights(roadmapItems);
  const stages = groupRoadmapByStages(roadmapItems);

  const [filterStatus, setFilterStatus] = useState<'All' | SkillStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [studyHours, setStudyHours] = useState(14.5);
  const [currentStreak, setCurrentStreak] = useState(4);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Interview preparation checklist state
  const [interviewChecklist, setInterviewChecklist] = useState([
    { id: '1', label: 'Core algorithmic problem solving (LeetCode / DSA basics)', done: true },
    { id: '2', label: 'Full-stack / domain capstone project deployed online', done: true },
    { id: '3', label: 'System architecture / API design mock explanation', done: false },
    { id: '4', label: 'Behavioral STAR-method stories prepared for engineering managers', done: false },
    { id: '5', label: 'Resume tailored with quantified project impact metrics', done: false },
  ]);

  const toggleInterviewItem = (id: string) => {
    setInterviewChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleLogStudyTime = (addedHours: number) => {
    setStudyHours((prev) => Number((prev + addedHours).toFixed(1)));
    if (!hasLoggedToday) {
      setCurrentStreak((prev) => prev + 1);
      setHasLoggedToday(true);
    }
  };

  const handleShare = () => {
    const text = `📊 My SkillPath Progress Track for ${career.title}:
Completed: ${insights.completedCount}/${insights.total} skills (${insights.progressPercent}%)
Study Hours Logged: ${studyHours} hrs | Streak: ${currentStreak} days
Readiness: ${readinessScore}% Career Ready
Built with SkillPath: Student to Job-Ready.`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fafafa]"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#27272a] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Live Progress Track
            </span>
            <span className="text-xs text-[#71717a]">• Granular Milestone Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Progress Track: {career.title}
          </h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">
            Track, update, and verify every milestone required to become interview-ready.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="track-share-btn"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#18181b] text-[#fafafa] border border-[#27272a] hover:bg-[#27272a] transition-colors shadow-xs"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />}
            <span>{copiedShare ? 'Copied Link!' : 'Share Track'}</span>
          </button>

          <button
            id="track-back-dashboard-btn"
            onClick={onGoToDashboard}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Dashboard</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        {/* Progress Bar Gauge */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] block">
              Roadmap Completion
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{insights.progressPercent}%</span>
              <span className="text-xs font-semibold text-emerald-400">
                {insights.completedCount}/{insights.total} skills
              </span>
            </div>
          </div>
          <div className="mt-3 w-full bg-[#09090b] rounded-full h-2.5 overflow-hidden border border-[#27272a]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(4, insights.progressPercent)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
            />
          </div>
        </div>

        {/* Study Hours Tracker */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">
                Study Time Logged
              </span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">{studyHours}</span>
              <span className="text-xs font-bold text-[#a1a1aa]">hours total</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => handleLogStudyTime(0.5)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#09090b] hover:bg-[#27272a] text-blue-400 border border-[#27272a] transition-colors"
            >
              +30m Log
            </button>
            <button
              onClick={() => handleLogStudyTime(1.0)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#09090b] hover:bg-[#27272a] text-blue-400 border border-[#27272a] transition-colors"
            >
              +1h Log
            </button>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">
                Learning Streak
              </span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">{currentStreak}</span>
              <span className="text-xs font-bold text-amber-400">days streak</span>
            </div>
          </div>
          <span className="mt-3 text-[11px] text-[#71717a]">
            {hasLoggedToday ? '🔥 Logged today! Keep it going.' : '⏳ Log study time to maintain streak.'}
          </span>
        </div>

        {/* Interview Readiness Status */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">
                Interview Readiness
              </span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">
                {interviewChecklist.filter((i) => i.done).length}/{interviewChecklist.length}
              </span>
              <span className="text-xs font-bold text-purple-400">benchmarks</span>
            </div>
          </div>
          <span className="mt-3 text-[11px] text-[#71717a]">Portfolio, DSA & STAR stories</span>
        </div>
      </div>

      {/* Main Workspace: Milestone Stage Tracker + Filter controls */}
      <div className="mt-10">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-[#18181b] border border-[#27272a]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, tools, or concepts in your roadmap..."
              className="w-full pl-10 pr-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[#71717a] font-medium mr-1 text-[11px]">Filter:</span>
            {(['All', 'Completed', 'Learning', 'Not Started'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#09090b] text-[#a1a1aa] hover:text-white border border-[#27272a]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Stages */}
        <div className="space-y-6">
          {stages.map((stage) => {
            const filteredItems = stage.items.filter((item) => {
              const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
              const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesFilter && matchesSearch;
            });

            if (filteredItems.length === 0 && (filterStatus !== 'All' || searchQuery)) {
              return null;
            }

            const stageCompleted = stage.items.filter((i) => i.status === 'Completed').length;
            const isFinished = stage.items.length > 0 && stageCompleted === stage.items.length;
            const isActiveStage = stage.stageNumber === insights.activeStageNumber;

            return (
              <motion.div
                key={stage.stageNumber}
                layout
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
                          Active Stage
                        </span>
                      )}
                      {isFinished && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#a1a1aa] mt-1">{stage.subtitle}</p>
                  </div>

                  <div className="text-xs font-semibold text-[#a1a1aa]">
                    {stageCompleted} / {stage.items.length} completed
                  </div>
                </div>

                {/* Items List */}
                <div className="p-3 sm:p-4 space-y-2.5">
                  {filteredItems.map((item) => {
                    const isExpanded = expandedItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`p-3 sm:p-4 rounded-xl border transition-all ${
                          item.status === 'Completed'
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : item.status === 'Learning'
                            ? 'bg-blue-950/30 border-blue-500/40 shadow-xs'
                            : 'bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                              {item.status === 'Completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : item.status === 'Learning' ? (
                                <CircleDot className="w-5 h-5 text-blue-400 animate-pulse" />
                              ) : (
                                <Clock className="w-5 h-5 text-[#52525b]" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-xs text-[#a1a1aa] mt-1">{item.whyItMatters}</p>
                            </div>
                          </div>

                          {/* Quick Status Selector */}
                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                            {(['Completed', 'Learning', 'Not Started'] as SkillStatus[]).map((st) => (
                              <button
                                key={st}
                                onClick={() => onUpdateStatus(item.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  item.status === st
                                    ? st === 'Completed'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'Learning'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-[#27272a] text-white'
                                    : 'text-[#a1a1aa] hover:text-white bg-[#18181b] border border-[#27272a]'
                                }`}
                              >
                                {st}
                              </button>
                            ))}

                            <button
                              onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                              className="p-1.5 text-[#71717a] hover:text-white rounded-lg transition-colors ml-1"
                              title={isExpanded ? 'Hide details' : 'Show details'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Resource & Action Info */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 pt-3 border-t border-[#27272a] text-xs text-[#a1a1aa] flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden"
                            >
                              <div>
                                <span className="font-semibold text-white">Recommended Action: </span>
                                <span>{item.recommendedAction}</span>
                              </div>
                              <span className="text-[11px] text-blue-400 font-medium shrink-0">
                                {item.whyItMatters}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section: Interview & Career Readiness Benchmarks */}
      <div className="mt-12 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Interview Readiness Benchmarks</span>
            </h3>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Verify these 5 crucial milestones before applying to entry-level {career.title} roles.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            {interviewChecklist.filter((i) => i.done).length} / {interviewChecklist.length} Verified
          </span>
        </div>

        <div className="space-y-2.5">
          {interviewChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleInterviewItem(item.id)}
              className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                item.done
                  ? 'bg-emerald-950/15 border-emerald-500/30 text-white'
                  : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 border ${
                  item.done
                    ? 'bg-emerald-500 border-emerald-400 text-black'
                    : 'bg-[#18181b] border-[#3f3f46] text-transparent'
                }`}
              >
                ✓
              </div>
              <span className={`text-xs font-medium ${item.done ? 'line-through text-[#71717a]' : 'text-white'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
