import React, { useState, useEffect, useMemo } from 'react';
import { UserSkillPathState, CareerId, SkillStatus, RoadmapItem } from './types';
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
import { SkillPathLogo } from './components/SkillPathLogo';

export default function App() {
  const [state, setState] = useState<UserSkillPathState>(() => loadSavedState());

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

  // Navigation handler
  const handleNavigate = (view: UserSkillPathState['currentView']) => {
    setState((prev) => ({ ...prev, currentView: view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Career
  const handleSelectCareer = (careerId: CareerId) => {
    setState((prev) => {
      // If user is switching to a different career, recalculate roadmap items if already generated
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

      // Update roadmap if career is selected
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
      // Re-generate roadmap items based on latest selected skills
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

  // Load sample demo (Data Analyst)
  const handleLoadDemo = () => {
    const demo = getDemoState('data-analyst');
    setState(demo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        state={state}
        onNavigate={handleNavigate}
        onReset={handleReset}
        onLoadDemo={handleLoadDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {state.currentView === 'landing' && (
          <LandingHero
            onStart={() => handleNavigate('career-select')}
            onLoadDemo={handleLoadDemo}
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
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#27272a] bg-[#09090b] py-8 text-center text-xs text-[#a1a1aa]">
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
