import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogOut,
  Briefcase,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { UserProfile, CareerId } from '../types';
import { CAREERS } from '../data/careers';
import { authenticateUser, registerNewUser, DEMO_USER } from '../utils/storage';

interface AuthSectionProps {
  currentUser?: UserProfile | null;
  onAuthSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateToFlow?: (target: 'career-select' | 'dashboard') => void;
  defaultTab?: 'login' | 'signup';
  isStandaloneView?: boolean;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  currentUser,
  onAuthSuccess,
  onLogout,
  onNavigateToFlow,
  defaultTab = 'signup',
  isStandaloneView = false,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [careerGoal, setCareerGoal] = useState<string>('data-analyst');
  const [experienceLevel, setExperienceLevel] = useState('Final-Year Engineering Student');

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetMessages();
  };

  const handleQuickDemoFill = () => {
    setEmail(DEMO_USER.email);
    setPassword('password123');
    setMode('login');
    resetMessages();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      const result = registerNewUser(name, email, password, careerGoal, experienceLevel);
      setIsSubmitting(false);

      if (result.success && result.user) {
        setSuccessMessage(`Account created successfully! Welcome to SkillPath, ${result.user.name}.`);
        onAuthSuccess(result.user);
      } else {
        setErrorMessage(result.error || 'Registration failed.');
      }
    } else {
      const result = authenticateUser(email, password);
      setIsSubmitting(false);

      if (result.success && result.user) {
        setSuccessMessage(`Welcome back, ${result.user.name}!`);
        onAuthSuccess(result.user);
      } else {
        setErrorMessage(result.error || 'Invalid credentials.');
      }
    }
  };

  // If already logged in, show personalized account card
  if (currentUser) {
    return (
      <section
        id="auth-section"
        className={`w-full ${
          isStandaloneView ? 'py-12 min-h-[70vh] flex items-center justify-center' : 'py-16'
        } bg-[#09090b] text-white`}
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6 w-full">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Logged In
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              <button
                id="auth-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#a1a1aa] hover:text-rose-400 hover:bg-rose-500/10 border border-[#27272a] hover:border-rose-500/20 transition-colors"
                title="Log out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[#27272a] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#09090b] border border-[#27272a]">
                <span className="text-[#71717a] block text-[11px] mb-1">Target Career</span>
                <span className="text-white font-semibold flex items-center gap-1.5 capitalize">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  {currentUser.careerGoal ? currentUser.careerGoal.replace(/-/g, ' ') : 'Not selected yet'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#09090b] border border-[#27272a]">
                <span className="text-[#71717a] block text-[11px] mb-1">Experience Level</span>
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  {currentUser.experienceLevel || 'Student / Job Seeker'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigateToFlow?.('career-select')}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Continue Career Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateToFlow?.('dashboard')}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-[#fafafa] bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] transition-all"
              >
                <span>Go to Progress Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="auth-section"
      className={`w-full ${
        isStandaloneView ? 'py-12 min-h-[80vh] flex items-center justify-center' : 'py-16'
      } bg-[#09090b] border-b border-[#27272a] text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Personalized Student Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {mode === 'signup' ? 'Create your SkillPath account' : 'Sign in to your SkillPath account'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#a1a1aa]">
              {mode === 'signup'
                ? 'Save your custom roadmap, track progress across devices, and get personalized AI mentorship.'
                : 'Access your saved career goals, skill gaps, and learning milestones.'}
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-7 shadow-2xl relative">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-[#09090b] p-1 border border-[#27272a] mb-6">
              <button
                id="auth-tab-signup"
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                id="auth-tab-login"
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                Log In
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-medium text-[#fafafa] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500 transition-colors"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label htmlFor="auth-email" className="block text-xs font-medium text-[#fafafa] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Career Goal & Level (Sign Up only) */}
              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="auth-career-goal" className="block text-xs font-medium text-[#fafafa] mb-1.5">
                      Target Career
                    </label>
                    <select
                      id="auth-career-goal"
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {CAREERS.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#18181b] text-white">
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="auth-exp-level" className="block text-xs font-medium text-[#fafafa] mb-1.5">
                      Current Stage
                    </label>
                    <select
                      id="auth-exp-level"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Final-Year Engineering Student">Final-Year Student</option>
                      <option value="Pre-Final Year Student">Pre-Final Year</option>
                      <option value="Fresh Graduate / Job Seeker">Recent Graduate</option>
                      <option value="Self-Taught Developer">Self-Taught</option>
                      <option value="Career Switcher">Career Switcher</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="auth-password" className="block text-xs font-medium text-[#fafafa] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#fafafa] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-confirm-password" className="block text-xs font-medium text-[#fafafa] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500 transition-colors"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#a1a1aa] hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#09090b] border-[#27272a] text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Remember this device</span>
                </label>

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() =>
                      alert('Password recovery: A password reset link can be sent to your registered email.')
                    }
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                id="auth-submit-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-60"
              >
                <span>{mode === 'signup' ? 'Create SkillPath Account' : 'Sign In to SkillPath'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Login Preset */}
            <div className="mt-5 pt-5 border-t border-[#27272a] text-center">
              <button
                id="auth-demo-fill-btn"
                type="button"
                onClick={handleQuickDemoFill}
                className="inline-flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-blue-400 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Fill sample student credentials (1-click test)</span>
              </button>
            </div>

            {/* Switch Mode Prompt Footer */}
            <div className="mt-4 text-center text-xs text-[#a1a1aa]">
              {mode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signup')}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign up free
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
