
import React, { useState, useEffect } from 'react';
import { Trophy, Target, Zap, Star, Award, Heart, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress, useUserStreak } from '@/hooks/useRoadmap';
import { useMotivationalTips, useCreateTip, useDeleteTip, useUserAchievements, useCreateAchievement } from '@/hooks/useAdminContent';

const MotivationalTherapy = () => {
  const { user, isAdmin } = useAuth();
  const { data: userProgress = [] } = useUserProgress(user?.id);
  const { data: userStreak } = useUserStreak(user?.id);
  const { data: tips = [] } = useMotivationalTips();
  const { data: userAchievements = [] } = useUserAchievements(user?.id);
  const createTipMutation = useCreateTip();
  const deleteTipMutation = useDeleteTip();
  const createAchievementMutation = useCreateAchievement();

  const [currentQuote, setCurrentQuote] = useState(0);
  const [newTip, setNewTip] = useState('');
  const [newTipCategory, setNewTipCategory] = useState('motivation');
  const [showAddTip, setShowAddTip] = useState(false);

  // Calculate real achievements based on user progress
  const completedDays = userProgress.filter(p => p.completion_percentage === 100).length;
  const totalStudyHours = Math.round(completedDays * 1.5); // Estimate 1.5 hours per day
  const currentStreakDays = userStreak?.current_streak || 0;

  const staticAchievements = [
    { 
      id: 'first_steps', 
      name: 'First Steps', 
      description: 'Started your learning journey', 
      unlocked: userProgress.length > 0, 
      icon: Star 
    },
    { 
      id: 'week_warrior', 
      name: 'Week Warrior', 
      description: 'Completed 7 consecutive days', 
      unlocked: currentStreakDays >= 7, 
      icon: Trophy 
    },
    { 
      id: 'consistency_master', 
      name: 'Consistency Master', 
      description: 'Completed 30 days total', 
      unlocked: completedDays >= 30, 
      icon: Target 
    },
    { 
      id: 'dedication_champion', 
      name: 'Dedication Champion', 
      description: 'Completed 50 days total', 
      unlocked: completedDays >= 50, 
      icon: Award 
    },
  ];

  const allAchievements = [...staticAchievements, ...userAchievements.map(ua => ({
    id: ua.id,
    name: ua.achievement_name,
    description: ua.achievement_description,
    unlocked: true,
    icon: Trophy
  }))];

  useEffect(() => {
    if (tips.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % tips.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [tips.length]);

  const handleAddTip = async () => {
    if (!newTip.trim()) return;
    
    try {
      await createTipMutation.mutateAsync({
        tip: newTip,
        category: newTipCategory,
      });
      setNewTip('');
      setShowAddTip(false);
    } catch (error) {
      console.error('Error adding tip:', error);
    }
  };

  const handleDeleteTip = async (tipId: string) => {
    try {
      await deleteTipMutation.mutateAsync(tipId);
    } catch (error) {
      console.error('Error deleting tip:', error);
    }
  };

  const getRandomTip = () => {
    if (tips.length === 0) return "Keep pushing forward!";
    return tips[Math.floor(Math.random() * tips.length)].tip;
  };

  const currentQuoteData = tips[currentQuote] || { tip: "Keep learning and growing!", category: "motivation" };

  return (
    <div className="space-y-6">
      {/* Hero Quote Section */}
      <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mb-4">
              <Heart className="h-12 w-12 mx-auto text-pink-200" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
              "{currentQuoteData.tip}"
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentQuoteData.category}
              </Badge>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTip(currentQuoteData.id)}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {tips.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuote(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentQuote ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Add Tip Section */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Manage Tips</span>
              <Button onClick={() => setShowAddTip(!showAddTip)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tip
              </Button>
            </CardTitle>
          </CardHeader>
          {showAddTip && (
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter motivational tip..."
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                />
                <Select value={newTipCategory} onValueChange={setNewTipCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motivation">Motivation</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="habits">Habits</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="mindset">Mindset</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddTip} disabled={!newTip.trim()}>
                  Add Tip
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Your Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                      achievement.unlocked
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        achievement.unlocked
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-yellow-500 text-white">
                        Unlocked!
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Real Progress Data */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span>Daily Boost</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <div className="mb-4">
                  <Star className="h-8 w-8 mx-auto text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {getRandomTip()}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  Get New Tip
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Celebration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-800 dark:text-green-200">Days Completed</span>
                  <Badge className="bg-green-500 text-white">{completedDays}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-800 dark:text-blue-200">Learning Streak</span>
                  <Badge className="bg-blue-500 text-white">{currentStreakDays} days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-purple-800 dark:text-purple-200">Total Study Hours</span>
                  <Badge className="bg-purple-500 text-white">{totalStudyHours}h</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Encouragement Section */}
      <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">You're Doing Great!</h3>
            <p className="text-green-100">
              Every line of code you write, every concept you grasp, and every challenge you overcome
              brings you closer to your goals. Keep pushing forward with ManasMitra!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationalTherapy;
