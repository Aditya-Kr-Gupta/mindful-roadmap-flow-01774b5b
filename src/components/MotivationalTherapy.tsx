
import React, { useState, useEffect } from 'react';
import { Trophy, Target, Zap, Star, Award, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const MotivationalTherapy = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Steps', description: 'Started your learning journey', unlocked: true, icon: Star },
    { id: 2, name: 'Week Warrior', description: 'Completed 7 consecutive days', unlocked: true, icon: Trophy },
    { id: 3, name: 'Code Master', description: 'Finished 50 coding exercises', unlocked: false, icon: Target },
    { id: 4, name: 'Project Pioneer', description: 'Completed first major project', unlocked: false, icon: Award },
  ]);

  const quotes = [
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
      category: "Growth"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Persistence"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Passion"
    },
    {
      text: "Code is like humor. When you have to explain it, it's bad.",
      author: "Cory House",
      category: "Technical"
    },
    {
      text: "Learning never exhausts the mind.",
      author: "Leonardo da Vinci",
      category: "Learning"
    }
  ];

  const motivationalTips = [
    "Remember why you started this journey",
    "Small progress is still progress",
    "Every expert was once a beginner",
    "Consistency beats perfection",
    "Celebrate your small wins",
    "Focus on growth, not perfection"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRandomTip = () => {
    return motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
  };

  const currentQuoteData = quotes[currentQuote];

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
              "{currentQuoteData.text}"
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <cite className="text-pink-200">— {currentQuoteData.author}</cite>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentQuoteData.category}
              </Badge>
            </div>
            <div className="flex justify-center space-x-2 mt-6">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentQuote ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
              {achievements.map((achievement) => {
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

        {/* Daily Motivation */}
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
                  <span className="text-green-800 dark:text-green-200">Tasks Completed Today</span>
                  <Badge className="bg-green-500 text-white">3/5</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-800 dark:text-blue-200">Learning Streak</span>
                  <Badge className="bg-blue-500 text-white">7 days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-purple-800 dark:text-purple-200">Total Study Hours</span>
                  <Badge className="bg-purple-500 text-white">42h</Badge>
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
              brings you closer to your goals. Keep pushing forward!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationalTherapy;
