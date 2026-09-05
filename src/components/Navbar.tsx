import React from 'react';
import { Compass, RotateCcw, Sparkles, LayoutDashboard, Map, SplitSquareVertical, Briefcase, ChevronRight } from 'lucide-react';
import { UserSkillPathState } from '../types';
import { SkillPathLogo } from './SkillPathLogo';

interface NavbarProps {
  state: UserSkillPathState;
  onNavigate: (view: UserSkillPathState['currentView']) => void;
  onReset: () => void;
  onLoadDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ state, onNavigate, onReset, onLoadDemo }) => {
  const hasSelectedCareer = Boolean(state.selectedCareerId);
  const hasRoadmap = state.roadmapItems.length > 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272a] bg-[#09090b]/95 backdrop-blur-md transition-all text-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-6">
          <button
            id="nav-logo-button"
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <SkillPathLogo variant="mark" size={40} className="shadow-lg shadow-blue-500/25" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#fafafa] flex items-center">
                  Sk<span className="text-white relative">
                    i
                    <span className="absolute -top-1 left-0.5 text-[8px] text-cyan-400">▶</span>
                  </span>ll
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 font-black">
                    Path
                  </span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Pro
                </span>
              </div>
              <p className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#a1a1aa] tracking-tight">
                <span>Learn</span>
                <span className="text-cyan-400 font-bold">•</span>
                <span>Grow</span>
                <span className="text-purple-400 font-bold">•</span>
                <span>Get Job-Ready</span>
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Bar Links (Text Only, Progress Track instead of Dashboard) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-[#a1a1aa]">
          <button
            id="nav-link-career"
            onClick={() => onNavigate('career-select')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              state.currentView === 'career-select'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            Career
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />
          <button
            id="nav-link-skills"
            onClick={() => onNavigate(hasSelectedCareer ? 'skills-setup' : 'career-select')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              state.currentView === 'skills-setup'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            Skills
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />
          <button
            id="nav-link-gap"
            onClick={() => onNavigate(hasSelectedCareer ? 'skill-gap' : 'career-select')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              state.currentView === 'skill-gap'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            Gap Analysis
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />
          <button
            id="nav-link-roadmap"
            onClick={() => onNavigate(hasSelectedCareer ? 'roadmap' : 'career-select')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              state.currentView === 'roadmap'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            Roadmap
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />
          <button
            id="nav-link-progress-track"
            onClick={() => onNavigate(hasSelectedCareer ? 'dashboard' : 'career-select')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              state.currentView === 'dashboard'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            Progress Track
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasRoadmap && (
            <button
              id="nav-dashboard-shortcut"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                state.currentView === 'dashboard'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                  : 'text-[#fafafa] bg-[#18181b] hover:bg-[#27272a] border border-[#27272a]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">My Dashboard</span>
            </button>
          )}

          {!hasRoadmap && (
            <button
              id="nav-load-sample-btn"
              onClick={onLoadDemo}
              title="Load realistic sample data (Data Analyst: Excel, SQL, Python)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Load Sample</span>
            </button>
          )}

          {hasSelectedCareer && (
            <button
              id="nav-reset-button"
              onClick={onReset}
              title="Reset progress and start fresh"
              className="p-2 text-[#a1a1aa] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="sr-only">Reset Path</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
