import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  LayoutDashboard,
  Map,
  SplitSquareVertical,
  Briefcase,
  ChevronRight,
  Menu,
  X,
  Target,
  GraduationCap,
  User,
  LogOut,
  Lock,
  LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSkillPathState } from '../types';
import { SkillPathLogo } from './SkillPathLogo';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  state: UserSkillPathState;
  onNavigate: (view: UserSkillPathState['currentView']) => void;
  onReset: () => void;
  onLoadDemo: () => void;
  onLogout?: () => void;
  onRequireAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onNavigate,
  onReset,
  onLoadDemo,
  onLogout,
  onRequireAuth,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authAlertMessage, setAuthAlertMessage] = useState<string | null>(null);

  const isAuthenticated = Boolean(state.currentUser);
  const hasSelectedCareer = Boolean(state.selectedCareerId);
  const hasRoadmap = state.roadmapItems.length > 0;

  const triggerAuthGatedNotice = () => {
    setAuthAlertMessage('Please sign in or register to access this feature.');
    setTimeout(() => setAuthAlertMessage(null), 3500);

    if (onRequireAuth) {
      onRequireAuth();
    } else if (state.currentView === 'landing') {
      const el = document.getElementById('auth-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate('auth');
      }
    } else {
      onNavigate('auth');
    }
  };

  const handleProtectedNavigate = (view: UserSkillPathState['currentView']) => {
    if (!isAuthenticated) {
      triggerAuthGatedNotice();
      return;
    }
    onNavigate(view);
  };

  const handleMobileNavClick = (view: UserSkillPathState['currentView']) => {
    setIsMobileMenuOpen(false);
    handleProtectedNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272a] bg-[#09090b]/95 backdrop-blur-md transition-all text-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-6">
          <button
            id="nav-logo-button"
            onClick={() => {
              onNavigate('landing');
              setIsMobileMenuOpen(false);
            }}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <SkillPathLogo variant="mark" size={40} className="shadow-lg shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105" />
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

        {/* Navigation Bar Links (Desktop / Landscape) */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-[#a1a1aa]">
          {/* Career */}
          <button
            id="nav-link-career"
            onClick={() => handleProtectedNavigate('career-select')}
            title={!isAuthenticated ? 'Sign in to access Career selection' : 'Select target career'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              !isAuthenticated
                ? 'opacity-65 hover:opacity-100 hover:text-white cursor-pointer'
                : state.currentView === 'career-select'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <span>Career</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-[#71717a]" />}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />

          {/* Skills */}
          <button
            id="nav-link-skills"
            onClick={() => handleProtectedNavigate(hasSelectedCareer ? 'skills-setup' : 'career-select')}
            title={!isAuthenticated ? 'Sign in to access Skills setup' : 'Select skills'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              !isAuthenticated
                ? 'opacity-65 hover:opacity-100 hover:text-white cursor-pointer'
                : state.currentView === 'skills-setup'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <span>Skills</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-[#71717a]" />}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />

          {/* Gap Analysis */}
          <button
            id="nav-link-gap"
            onClick={() => handleProtectedNavigate(hasSelectedCareer ? 'skill-gap' : 'career-select')}
            title={!isAuthenticated ? 'Sign in to access Gap Analysis' : 'Analyze skill gaps'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              !isAuthenticated
                ? 'opacity-65 hover:opacity-100 hover:text-white cursor-pointer'
                : state.currentView === 'skill-gap'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <span>Gap Analysis</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-[#71717a]" />}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />

          {/* Roadmap */}
          <button
            id="nav-link-roadmap"
            onClick={() => handleProtectedNavigate(hasSelectedCareer ? 'roadmap' : 'career-select')}
            title={!isAuthenticated ? 'Sign in to access Learning Roadmap' : 'Personalized learning roadmap'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              !isAuthenticated
                ? 'opacity-65 hover:opacity-100 hover:text-white cursor-pointer'
                : state.currentView === 'roadmap'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <span>Roadmap</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-[#71717a]" />}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46]" />

          {/* Progress Track (Distinct dedicated page!) */}
          <button
            id="nav-link-progress-track"
            onClick={() => handleProtectedNavigate(hasSelectedCareer ? 'progress-track' : 'career-select')}
            title={!isAuthenticated ? 'Sign in to access Progress Track' : 'Milestone progress tracker'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              !isAuthenticated
                ? 'opacity-65 hover:opacity-100 hover:text-white cursor-pointer'
                : state.currentView === 'progress-track'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                : 'hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <span>Progress Track</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-[#71717a]" />}
          </button>
        </nav>

        {/* Actions + Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Balancing Button */}
          <ThemeToggle />

          {/* My Dashboard Shortcut Button */}
          {isAuthenticated && hasRoadmap && (
            <button
              id="nav-dashboard-shortcut"
              onClick={() => handleProtectedNavigate('dashboard')}
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

          {/* Load Sample Demo Button */}
          {!hasRoadmap && (
            <button
              id="nav-load-sample-btn"
              onClick={onLoadDemo}
              title="Load realistic sample data (Data Analyst: Excel, SQL, Python)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Load Sample</span>
            </button>
          )}

          {isAuthenticated && hasSelectedCareer && (
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

          {/* User Profile or Sign In Button (Desktop) */}
          {state.currentUser ? (
            <div className="hidden sm:flex items-center gap-1.5 pl-1 border-l border-[#27272a]">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                  {state.currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium max-w-[90px] truncate">
                  {state.currentUser.name}
                </span>
              </div>
              {onLogout && (
                <button
                  id="nav-logout-button"
                  onClick={onLogout}
                  title="Sign out of your account"
                  className="p-1.5 text-[#71717a] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="sr-only">Log Out</span>
                </button>
              )}
            </div>
          ) : (
            <button
              id="nav-auth-shortcut"
              onClick={() => {
                if (state.currentView === 'landing') {
                  const el = document.getElementById('auth-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    return;
                  }
                }
                onNavigate('auth');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Hamburger Menu Button (Mobile & Tablet Views) */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex lg:hidden items-center justify-center p-2 rounded-xl text-[#fafafa] bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-blue-400" />
            ) : (
              <Menu className="w-5 h-5 text-[#fafafa]" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Auth Notification if non-logged in user clicked a locked feature */}
      <AnimatePresence>
        {authAlertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full bg-blue-600/90 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-lg"
          >
            <Lock className="w-3.5 h-3.5 text-blue-200" />
            <span>{authAlertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile and Tablet Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[#27272a] bg-[#0c0c0e]/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
              {/* Account Status in Drawer */}
              {state.currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#18181b] border border-[#27272a]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                      {state.currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{state.currentUser.name}</div>
                      <div className="text-[11px] text-[#a1a1aa] truncate">{state.currentUser.email}</div>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-colors shrink-0 ml-2"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#18181b] border border-[#27272a] gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white block">Student Portal</span>
                    <span className="text-[11px] text-[#a1a1aa] block truncate">
                      Sign in to access features and save roadmaps
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (state.currentView === 'landing') {
                        const el = document.getElementById('auth-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                          return;
                        }
                      }
                      onNavigate('auth');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0 shadow-sm"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Active Career Indicator (if chosen) */}
              {hasSelectedCareer && (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-[#71717a]">Target:</span>
                    <span className="font-semibold text-white capitalize">
                      {state.selectedCareerId?.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Active
                  </span>
                </div>
              )}

              {/* Navigation links */}
              <nav className="flex flex-col space-y-1">
                <button
                  id="mobile-nav-career"
                  onClick={() => handleMobileNavClick('career-select')}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !isAuthenticated
                      ? 'opacity-60 text-[#a1a1aa] hover:text-white'
                      : state.currentView === 'career-select'
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span>Career</span>
                  </div>
                  {!isAuthenticated ? (
                    <Lock className="w-3.5 h-3.5 text-[#71717a]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#52525b]" />
                  )}
                </button>

                <button
                  id="mobile-nav-skills"
                  onClick={() => handleMobileNavClick(hasSelectedCareer ? 'skills-setup' : 'career-select')}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !isAuthenticated
                      ? 'opacity-60 text-[#a1a1aa] hover:text-white'
                      : state.currentView === 'skills-setup'
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SplitSquareVertical className="w-4 h-4 text-cyan-400" />
                    <span>Skills</span>
                  </div>
                  {!isAuthenticated ? (
                    <Lock className="w-3.5 h-3.5 text-[#71717a]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#52525b]" />
                  )}
                </button>

                <button
                  id="mobile-nav-gap"
                  onClick={() => handleMobileNavClick(hasSelectedCareer ? 'skill-gap' : 'career-select')}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !isAuthenticated
                      ? 'opacity-60 text-[#a1a1aa] hover:text-white'
                      : state.currentView === 'skill-gap'
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Gap Analysis</span>
                  </div>
                  {!isAuthenticated ? (
                    <Lock className="w-3.5 h-3.5 text-[#71717a]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#52525b]" />
                  )}
                </button>

                <button
                  id="mobile-nav-roadmap"
                  onClick={() => handleMobileNavClick(hasSelectedCareer ? 'roadmap' : 'career-select')}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !isAuthenticated
                      ? 'opacity-60 text-[#a1a1aa] hover:text-white'
                      : state.currentView === 'roadmap'
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Map className="w-4 h-4 text-purple-400" />
                    <span>Roadmap</span>
                  </div>
                  {!isAuthenticated ? (
                    <Lock className="w-3.5 h-3.5 text-[#71717a]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#52525b]" />
                  )}
                </button>

                <button
                  id="mobile-nav-progress-track"
                  onClick={() => handleMobileNavClick(hasSelectedCareer ? 'progress-track' : 'career-select')}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !isAuthenticated
                      ? 'opacity-60 text-[#a1a1aa] hover:text-white'
                      : state.currentView === 'progress-track'
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LineChart className="w-4 h-4 text-emerald-400" />
                    <span>Progress Track</span>
                  </div>
                  {!isAuthenticated ? (
                    <Lock className="w-3.5 h-3.5 text-[#71717a]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#52525b]" />
                  )}
                </button>

                {isAuthenticated && (
                  <button
                    id="mobile-nav-dashboard"
                    onClick={() => handleMobileNavClick('dashboard')}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      state.currentView === 'dashboard'
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                        : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      <span>My Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#52525b]" />
                  </button>
                )}
              </nav>

              {/* Quick Actions inside mobile/tablet drawer */}
              <div className="pt-3 border-t border-[#27272a] flex items-center justify-between gap-2.5">
                {isAuthenticated && hasRoadmap ? (
                  <button
                    onClick={() => handleMobileNavClick('dashboard')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onLoadDemo();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Sample</span>
                  </button>
                )}

                {hasSelectedCareer && (
                  <button
                    onClick={() => {
                      onReset();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium text-[#a1a1aa] hover:text-rose-400 hover:bg-rose-500/10 border border-[#27272a] hover:border-rose-500/20 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
