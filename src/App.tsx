import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSkillPathState, CareerId, SkillStatus, RoadmapItem, UserProfile } from './types';
import { CAREERS } from './data/careers';
import { loadSavedState, saveState, clearSavedState, getDemoState, DEFAULT_STATE } from './utils/storage';
import { analyzeSkillGap, generateInitialRoadmap } from './utils/roadmapGenerator';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { CareerSelect } from './components/CareerSelect';
import { SkillInput } from './components/SkillInput';
import { SkillGapView } from './components/SkillGapView';
import { RoadmapView } from './components/RoadmapView';
import { DashboardView } from './components/DashboardView';
import { ProgressTrackView } from './components/ProgressTrackView';
import { AuthSection } from './components/AuthSection';
import { SkillPathLogo } from './components/SkillPathLogo';

export default function App() {
  const [state, setState] = useState<UserSkillPathState>(() => {
    const loaded = loadSavedState();
    // Guard: If user is not logged in, enforce landing or auth view
    if (!loaded.currentUser && loaded.currentView !== 'landing' && loaded.currentView !== 'auth') {
      return {
        ...loaded,
        currentView: 'landing',
      };
    }
    return loaded;
  });

  // Automatically persist state changes to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Active selected career entity
  const selectedCareer = useMemo(() => {
    if (!state.selectedCareerId) return null;
    return CAREERS.find((c) => c.id === state.selectedCareerId) || null;
  }, [state.selectedCareerId]);

  // Real-time skill gap analysis
  const skillGapAnalysis = useMemo(() => {
    if (!selectedCareer) return null;
    return analyzeSkillGap(selectedCareer, state.selectedSkills);
  }, [selectedCareer, state.selectedSkills]);

  // Authentication-Guarded Navigation handler
  const handleNavigate = (view: UserSkillPathState['currentView']) => {
    // If user is not logged in, they cannot access protected views
    if (!state.currentUser && view !== 'landing' && view !== 'auth') {
      setState((prev) => ({ ...prev, currentView: 'auth' }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setState((prev) => ({ ...prev, currentView: view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth handlers
  const handleAuthSuccess = (user: UserProfile) => {
    setState((prev) => {
      let careerIdToSet = prev.selectedCareerId;
      if (!careerIdToSet && user.careerGoal) {
        const found = CAREERS.find((c) => c.id === user.careerGoal);
        if (found) {
          careerIdToSet = found.id;
        }
      }

      // If user already has a selected career, redirect them to career-select or dashboard
      const nextView = prev.currentView === 'auth'
        ? (careerIdToSet ? 'dashboard' : 'career-select')
        : prev.currentView;

      return {
        ...prev,
        currentUser: user,
        selectedCareerId: careerIdToSet,
        currentView: nextView,
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setState((prev) => ({
      ...prev,
      currentUser: null,
      currentView: 'landing',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Career
  const handleSelectCareer = (careerId: CareerId) => {
    setState((prev) => {
      const targetCareer = CAREERS.find((c) => c.id === careerId);
      const newRoadmap = targetCareer ? generateInitialRoadmap(targetCareer, prev.selectedSkills) : [];

      return {
        ...prev,
        selectedCareerId: careerId,
        roadmapItems: newRoadmap,
      };
    });
  };

  // Toggle skill selection
  const handleToggleSkill = (skillName: string) => {
    setState((prev) => {
      const exists = prev.selectedSkills.some((s) => s.toLowerCase() === skillName.toLowerCase());
      const nextSkills = exists
        ? prev.selectedSkills.filter((s) => s.toLowerCase() !== skillName.toLowerCase())
        : [...prev.selectedSkills, skillName];

      const targetCareer = prev.selectedCareerId ? CAREERS.find((c) => c.id === prev.selectedCareerId) : null;
      const updatedRoadmap = targetCareer ? generateInitialRoadmap(targetCareer, nextSkills) : prev.roadmapItems;

      return {
        ...prev,
        selectedSkills: nextSkills,
        roadmapItems: updatedRoadmap,
      };
    });
  };

  // Add custom skill
  const handleAddCustomSkill = (skillName: string) => {
    setState((prev) => {
      const nextSkills = [...prev.selectedSkills, skillName];
      const nextCustom = [...prev.customSkills, skillName];

      const targetCareer = prev.selectedCareerId ? CAREERS.find((c) => c.id === prev.selectedCareerId) : null;
      const updatedRoadmap = targetCareer ? generateInitialRoadmap(targetCareer, nextSkills) : prev.roadmapItems;

      return {
        ...prev,
        selectedSkills: nextSkills,
        customSkills: nextCustom,
        roadmapItems: updatedRoadmap,
      };
    });
  };

  // Remove skill
  const handleRemoveSkill = (skillName: string) => {
    setState((prev) => {
      const nextSkills = prev.selectedSkills.filter(
        (s) => s.toLowerCase() !== skillName.toLowerCase()
      );
      const targetCareer = prev.selectedCareerId ? CAREERS.find((c) => c.id === prev.selectedCareerId) : null;
      const updatedRoadmap = targetCareer ? generateInitialRoadmap(targetCareer, nextSkills) : prev.roadmapItems;

      return {
        ...prev,
        selectedSkills: nextSkills,
        roadmapItems: updatedRoadmap,
      };
    });
  };

  // Generate roadmap from skill gap
  const handleGenerateRoadmap = () => {
    if (!selectedCareer) return;

    setState((prev) => {
      const initialItems = generateInitialRoadmap(selectedCareer, prev.selectedSkills);
      return {
        ...prev,
        roadmapItems: initialItems,
        currentView: 'roadmap',
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update status of a roadmap item (Not Started -> Learning -> Completed)
  const handleUpdateStatus = (itemId: string, newStatus: SkillStatus) => {
    setState((prev) => {
      const updated = prev.roadmapItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus,
            completedAt: newStatus === 'Completed' ? new Date().toISOString() : undefined,
          };
        }
        return item;
      });

      return {
        ...prev,
        roadmapItems: updated,
      };
    });
  };

  // Reset entire application
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your SkillPath and start fresh?')) {
      clearSavedState();
      setState(DEFAULT_STATE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load sample demo (Data Analyst) with demo user profile authenticated
  const handleLoadDemo = () => {
    const demo = getDemoState('data-analyst');
    const demoUser: UserProfile = {
      id: 'demo-student-alex',
      name: 'Alex Chen (Demo Student)',
      email: 'alex.student@skillpath.dev',
      careerGoal: 'data-analyst',
      experienceLevel: 'Final-Year Student',
      joinedAt: new Date().toISOString(),
    };

    setState({
      ...demo,
      currentUser: demoUser,
      currentView: 'dashboard',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        state={state}
        onNavigate={handleNavigate}
        onReset={handleReset}
        onLoadDemo={handleLoadDemo}
        onLogout={handleLogout}
        onRequireAuth={() => handleNavigate('auth')}
      />

      {/* Main Content Area with View Transition Animation */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {state.currentView === 'landing' && (
              <LandingHero
                onStart={() => handleNavigate('career-select')}
                onLoadDemo={handleLoadDemo}
                currentUser={state.currentUser}
                onAuthSuccess={handleAuthSuccess}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            )}

            {state.currentView === 'auth' && (
              <AuthSection
                currentUser={state.currentUser}
                onAuthSuccess={handleAuthSuccess}
                onLogout={handleLogout}
                onNavigateToFlow={handleNavigate}
                isStandaloneView={true}
              />
            )}

            {state.currentView === 'career-select' && (
              <CareerSelect
                selectedCareerId={state.selectedCareerId}
                onSelectCareer={handleSelectCareer}
                onNext={() => handleNavigate('skills-setup')}
                onBack={() => handleNavigate('landing')}
              />
            )}

            {state.currentView === 'skills-setup' && selectedCareer && (
              <SkillInput
                career={selectedCareer}
                selectedSkills={state.selectedSkills}
                onToggleSkill={handleToggleSkill}
                onAddCustomSkill={handleAddCustomSkill}
                onRemoveSkill={handleRemoveSkill}
                onNext={() => handleNavigate('skill-gap')}
                onBack={() => handleNavigate('career-select')}
              />
            )}

            {state.currentView === 'skill-gap' && selectedCareer && skillGapAnalysis && (
              <SkillGapView
                analysis={skillGapAnalysis}
                onGenerateRoadmap={handleGenerateRoadmap}
                onEditSkills={() => handleNavigate('skills-setup')}
                onChangeCareer={() => handleNavigate('career-select')}
              />
            )}

            {state.currentView === 'roadmap' && selectedCareer && (
              <RoadmapView
                career={selectedCareer}
                items={state.roadmapItems}
                onUpdateStatus={handleUpdateStatus}
                onGoToDashboard={() => handleNavigate('dashboard')}
                onAdjustSkills={() => handleNavigate('skill-gap')}
              />
            )}

            {/* Dedicated Dashboard Page */}
            {state.currentView === 'dashboard' && selectedCareer && (
              <DashboardView
                career={selectedCareer}
                roadmapItems={state.roadmapItems}
                userSkills={state.selectedSkills}
                readinessScore={skillGapAnalysis?.readinessScore ?? 0}
                onUpdateStatus={handleUpdateStatus}
                onEditSkills={() => handleNavigate('skills-setup')}
                onChangeCareer={() => handleNavigate('career-select')}
                onReset={handleReset}
                onGoToProgressTrack={() => handleNavigate('progress-track')}
              />
            )}

            {/* Dedicated Progress Track Page */}
            {state.currentView === 'progress-track' && selectedCareer && (
              <ProgressTrackView
                career={selectedCareer}
                roadmapItems={state.roadmapItems}
                userSkills={state.selectedSkills}
                onUpdateStatus={handleUpdateStatus}
                onGoToDashboard={() => handleNavigate('dashboard')}
                onAdjustSkills={() => handleNavigate('skill-gap')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#27272a] bg-[#09090b] py-8 text-center text-xs text-[#a1a1aa] transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <SkillPathLogo variant="mark" size={22} />
            <span className="font-bold text-[#fafafa]">SkillPath</span>
            <span className="text-[#71717a]">— Learn • Grow • Get Job-Ready</span>
          </div>
          <div className="flex items-center gap-4 text-[#71717a]">
            <span>Built for students & entry-level job seekers</span>
            <span>•</span>
            <span>Local Browser Storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
