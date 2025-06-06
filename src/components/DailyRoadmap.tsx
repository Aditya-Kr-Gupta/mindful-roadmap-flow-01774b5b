
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Target, Trophy, Flame, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRoadmap, useUserProgress, useUserStreak, useUpdateProgress } from '@/hooks/useRoadmap';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const DailyRoadmap = () => {
  const { user } = useAuth();
  const { data: roadmap = [] } = useRoadmap();
  const { data: userProgress = [] } = useUserProgress(user?.id);
  const { data: userStreak } = useUserStreak(user?.id);
  const updateProgressMutation = useUpdateProgress();

  const [currentDay, setCurrentDay] = useState(1);

  const currentDayData = roadmap.find(day => day.day_number === currentDay);
  const currentProgress = userProgress.find(p => p.day_number === currentDay);
  const completedTasks = currentProgress?.completed_tasks || [];

  const handleTaskToggle = async (taskIndex: number) => {
    if (!user || !currentDayData) {
      toast.error('Please sign in to track progress');
      return;
    }

    const newCompletedTasks = completedTasks.includes(taskIndex)
      ? completedTasks.filter(t => t !== taskIndex)
      : [...completedTasks, taskIndex];

    const totalTasks = currentDayData.tasks?.length || 0;
    const completionPercentage = totalTasks > 0 ? Math.round((newCompletedTasks.length / totalTasks) * 100) : 0;

    updateProgressMutation.mutate({
      userId: user.id,
      dayNumber: currentDay,
      completedTasks: newCompletedTasks,
      completionPercentage,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletedDaysCount = () => {
    return userProgress.filter(p => p.completion_percentage === 100).length;
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum, p) => sum + p.completion_percentage, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  if (!currentDayData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Roadmap...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Current Day</p>
                <p className="text-2xl font-bold">{currentDay}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed Days</p>
                <p className="text-2xl font-bold">{getCompletedDaysCount()}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Overall Progress</p>
                <p className="text-2xl font-bold">{getOverallProgress()}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Current Streak</p>
                <p className="text-2xl font-bold">{userStreak?.current_streak || 0}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Day
            </Button>
            
            <div className="text-center">
              <CardTitle className="text-xl">Day {currentDay}: {currentDayData.title}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentDayData.week_info}</p>
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentDay(Math.min(90, currentDay + 1))}
              disabled={currentDay === 90}
            >
              Next Day
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Current Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{currentDayData.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{currentDayData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(currentDayData.difficulty)}>
                      {currentDayData.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentDayData.estimated_time}
                    </Badge>
                    <Badge variant="outline">
                      {currentDayData.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Progress</h4>
                    <span className="text-sm text-gray-600">
                      {completedTasks.length} / {currentDayData.tasks?.length || 0} tasks
                    </span>
                  </div>
                  <Progress 
                    value={(completedTasks.length / (currentDayData.tasks?.length || 1)) * 100} 
                    className="h-2"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Tasks</h4>
                  <div className="space-y-2">
                    {currentDayData.tasks?.map((task: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-auto ${
                            completedTasks.includes(index)
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                          onClick={() => handleTaskToggle(index)}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                        <span
                          className={`flex-1 ${
                            completedTasks.includes(index)
                              ? 'line-through text-gray-500'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                <Flame className="h-5 w-5" />
                <span>Learning Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {userStreak?.current_streak || 0}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    {userStreak?.current_streak === 1 ? 'day' : 'days'} in a row
                  </div>
                </div>
                
                <div className="text-center border-t pt-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Best: {userStreak?.longest_streak || 0} days
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Days</span>
                <span className="font-semibold">90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-semibold text-green-600">{getCompletedDaysCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                <span className="font-semibold text-orange-600">{90 - getCompletedDaysCount()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                  <span className="font-semibold text-blue-600">{getOverallProgress()}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyRoadmap;
