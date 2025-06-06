
import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Heart, Zap, Settings, Moon, Sun, User, Shield } from 'lucide-react';
import DailyRoadmap from '../components/DailyRoadmap';
import MotivationalTherapy from '../components/MotivationalTherapy';
import RelaxationTherapy from '../components/RelaxationTherapy';
import DistractionAvoidance from '../components/DistractionAvoidance';
import FlipClock from '../components/FlipClock';
import { AdminPanel } from '../components/AdminPanel';
import { AuthModal } from '../components/AuthModal';
import { Button } from '../components/ui/button';
import { AuthProvider, useAuth } from '../hooks/useAuth';

const AppContent = () => {
  const [activeMode, setActiveMode] = useState('roadmap');
  const [darkMode, setDarkMode] = useState(false);
  const [showFlipClock, setShowFlipClock] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const modes = [
    { id: 'roadmap', name: 'Daily Roadmap', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'motivation', name: 'Motivation', icon: Heart, color: 'bg-pink-500' },
    { id: 'relaxation', name: 'Relaxation', icon: Zap, color: 'bg-green-500' },
    { id: 'focus', name: 'Focus Tools', icon: Settings, color: 'bg-purple-500' },
  ];

  if (isAdmin) {
    modes.push({ id: 'admin', name: 'Admin Panel', icon: Shield, color: 'bg-red-500' });
  }

  const renderActiveMode = () => {
    switch (activeMode) {
      case 'roadmap':
        return <DailyRoadmap />;
      case 'motivation':
        return <MotivationalTherapy />;
      case 'relaxation':
        return <RelaxationTherapy />;
      case 'focus':
        return <DistractionAvoidance />;
      case 'admin':
        return isAdmin ? <AdminPanel /> : <DailyRoadmap />;
      default:
        return <DailyRoadmap />;
    }
  };

  if (showFlipClock) {
    return <FlipClock onClose={() => setShowFlipClock(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ManasMitra
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFlipClock(true)}
                className="hidden sm:flex items-center space-x-2"
              >
                <Clock className="h-4 w-4" />
                <span>Flip Clock</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </Button>

              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Welcome, {user.email}
                  </span>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    activeMode === mode.id
                      ? `${mode.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{mode.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderActiveMode()}
        </div>
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
