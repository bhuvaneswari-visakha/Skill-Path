import React from 'react';
import { ArrowRight, CheckCircle2, Target, Sparkles, Compass, AlertCircle, TrendingUp, Layers, Check, LogIn, UserCheck, Lock } from 'lucide-react';
import { CAREERS } from '../data/careers';
import { SkillPathLogo } from './SkillPathLogo';
import { AuthSection } from './AuthSection';
import { UserProfile, UserSkillPathState } from '../types';

interface LandingHeroProps {
  onStart: () => void;
  onLoadDemo: () => void;
  currentUser?: UserProfile | null;
  onAuthSuccess?: (user: UserProfile) => void;
  onLogout?: () => void;
  onNavigate?: (view: UserSkillPathState['currentView']) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStart,
  onLoadDemo,
  currentUser,
  onAuthSuccess,
  onLogout,
  onNavigate,
}) => {
  const scrollToAuth = () => {
    const el = document.getElementById('auth-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProtectedStart = () => {
    if (!currentUser) {
      scrollToAuth();
      return;
    }
    onStart();
  };

  return (
    <div className="w-full bg-[#09090b] text-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#27272a] bg-gradient-to-b from-[#121215] via-[#09090b] to-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            {/* Logo Emblem Accent */}
            <div className="mb-6 group">
              <SkillPathLogo variant="mark" size={84} className="shadow-2xl shadow-blue-600/30 transition-transform duration-300 group-hover:scale-105" />
            </div>

            {/* Mission Pill or Logged-In User Banner */}
            {currentUser ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Welcome back, {currentUser.name} • Signed In</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>For Final-Year Students & Entry-Level Job Seekers</span>
              </div>
            )}

            {/* Main Hero Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Build the right skills for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">career you want.</span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-lg sm:text-xl text-[#a1a1aa] leading-relaxed max-w-2xl mx-auto font-normal">
              SkillPath analyzes your current skills, identifies what you're missing, and creates a personalized roadmap to help you become job-ready.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xl">
              <button
                id="hero-cta-button"
                onClick={handleProtectedStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
              >
                {!currentUser && <Lock className="w-4 h-4 text-blue-200" />}
                <span>{currentUser ? 'Build My SkillPath' : 'Sign In to Build SkillPath'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                id="hero-demo-button"
                onClick={onLoadDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-[#fafafa] bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] shadow-xs active:scale-95 transition-all"
              >
                <span>Explore Live Demo</span>
              </button>

              {!currentUser && (
                <button
                  id="hero-auth-button"
                  onClick={scrollToAuth}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 shadow-xs active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>

            {/* Value Guarantees */}
            <div className="mt-10 pt-6 border-t border-[#27272a] flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#a1a1aa] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free & Open to All Students
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 7 High-Demand Tech Careers
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Skill-Gap Calculation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Sign Up & Log In Portal directly on Landing Page */}
      <AuthSection
        currentUser={currentUser}
        onAuthSuccess={(user) => onAuthSuccess?.(user)}
        onLogout={() => onLogout?.()}
        onNavigateToFlow={(target) => onNavigate?.(target)}
      />

      {/* The Core Journey: 5 Steps Visual Flow */}
      <section className="py-14 bg-[#09090b] border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
              The Journey
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              From confused student to job-ready candidate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {[
              { num: '01', title: 'Career Goal', desc: 'Choose your desired tech role' },
              { num: '02', title: 'Current Skills', desc: 'Select skills you already know' },
              { num: '03', title: 'Skill Gap', desc: 'See exact missing capabilities' },
              { num: '04', title: 'Learning Roadmap', desc: 'Prioritized stage-by-stage guide' },
              { num: '05', title: 'Progress Tracking', desc: 'Update status as you master skills' },
            ].map((step) => (
              <div
                key={step.num}
                className="relative bg-[#18181b] border border-[#27272a] rounded-xl p-5 hover:border-blue-500/40 transition-colors"
              >
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                  Step {step.num}
                </span>
                <h3 className="mt-3 text-base font-bold text-[#fafafa]">{step.title}</h3>
                <p className="mt-1 text-xs text-[#a1a1aa] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-16 bg-[#0c0c0e] border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Problem */}
            <div className="bg-[#18181b] border border-rose-500/30 rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  THE PROBLEM
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#fafafa]">
                  Wasting months learning irrelevant technologies
                </h3>
                <p className="mt-3 text-sm text-[#a1a1aa] leading-relaxed">
                  Many final-year students and fresh graduates struggle to identify <strong>what skills they should learn next</strong>. Without industry clarity, they jump between random YouTube tutorials, learn outdated frameworks, and graduate without meeting baseline job requirements.
                </p>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-rose-300/90 font-medium">
                <li className="flex items-center gap-2">✕ "Tutorial hell" without portfolio relevance</li>
                <li className="flex items-center gap-2">✕ Guessing what recruiters actually screen for</li>
                <li className="flex items-center gap-2">✕ No structured order of prerequisite topics</li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-[#18181b] border border-blue-500/30 rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  THE SKILLPATH SOLUTION
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#fafafa]">
                  A personalized, job-ready blueprint tailored to you
                </h3>
                <p className="mt-3 text-sm text-[#a1a1aa] leading-relaxed">
                  SkillPath bridges the gap by comparing your real background against verified career profiles. It instantly highlights what you already have, what you need to learn, and pinpointing your <strong>Next Recommended Skill</strong>.
                </p>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-blue-300/90 font-medium">
                <li className="flex items-center gap-2">✓ Objective Career Readiness score indicator</li>
                <li className="flex items-center gap-2">✓ 4 clear stages from Foundations to Capstone</li>
                <li className="flex items-center gap-2">✓ Real-time progress dashboard stored locally</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Example SkillPath Preview Showcase */}
      <section className="py-16 bg-[#09090b] border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Interactive Preview
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              See SkillPath in action
            </p>
            <p className="mt-2 text-sm text-[#a1a1aa]">
              Here is an example for a student targeting <strong>Data Analyst</strong> who already knows Excel, SQL, and Python.
            </p>
          </div>

          {/* Realistic Mock Card Showcase */}
          <div className="max-w-4xl mx-auto bg-[#18181b] text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#27272a]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#27272a] gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Example SkillPath</span>
                <h3 className="text-2xl font-bold text-white mt-1">Data Analyst</h3>
                <p className="text-xs text-[#a1a1aa] mt-0.5">Transform raw data into meaningful business insights & dashboards</p>
              </div>
              <div className="flex items-center gap-4 bg-[#09090b] px-4 py-3 rounded-xl border border-[#27272a]">
                <div>
                  <div className="text-2xl font-black text-emerald-400">72%</div>
                  <div className="text-[11px] font-medium text-[#a1a1aa]">Career Ready</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#27272a] border-t-emerald-400 flex items-center justify-center font-mono text-xs font-bold text-white">
                  3/7
                </div>
              </div>
            </div>

            {/* Current Focus & Next Up Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/30 rounded-xl p-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Current Focus</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  <h4 className="text-base font-bold text-white">Learn Pandas</h4>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-1">
                  Primary Python library for filtering, cleaning, and aggregating dataframes.
                </p>
              </div>

              <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4">
                <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wide">Next Up</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                  <h4 className="text-base font-bold text-[#fafafa]">Power BI</h4>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-1">
                  Executive business intelligence dashboards & interactive DAX reports.
                </p>
              </div>
            </div>

            {/* Sample stages snippet */}
            <div className="mt-6 pt-6 border-t border-[#27272a] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                <span className="text-emerald-400 font-bold block mb-1">✓ Stage 1: Foundations</span>
                <span className="text-[#a1a1aa]">Excel, SQL, Statistics (Completed)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#09090b] border border-blue-500/30">
                <span className="text-blue-400 font-bold block mb-1">→ Stage 2: Core Analysis</span>
                <span className="text-[#fafafa]">Python, Pandas, NumPy</span>
              </div>
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                <span className="text-[#71717a] font-bold block mb-1">⏳ Stage 3: Visuals & Capstone</span>
                <span className="text-[#71717a]">Power BI & GitHub Portfolio</span>
              </div>
            </div>

            {/* CTA inside preview */}
            <div className="mt-6 text-center">
              <button
                onClick={onLoadDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Launch This Sample Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-16 bg-[#09090b] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Stop guessing. Start mastering.
          </h2>
          <p className="mt-4 text-[#a1a1aa] text-base leading-relaxed">
            Choose your target career, input what you know, and get your personalized roadmap in under 60 seconds.
          </p>
          <div className="mt-8">
            <button
              onClick={handleProtectedStart}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/25 active:scale-95 transition-all"
            >
              {!currentUser && <Lock className="w-4 h-4 text-blue-200" />}
              <span>{currentUser ? 'Build My SkillPath Now' : 'Sign In to Build SkillPath'}</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
