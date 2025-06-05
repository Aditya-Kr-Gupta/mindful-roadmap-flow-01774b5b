
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Calendar, TrendingUp, Target, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

const DailyRoadmap = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [streak, setStreak] = useState(7);

  const roadmapData = {
    1: {
      title: "Java Fundamentals Review",
      description: "Review Java fundamentals (loops, conditions, OOP basics)",
      week: "Week 1-4: Foundations and Core Development",
      category: "Java Basics to Advanced",
      tasks: [
        "Review variable types and operators",
        "Practice loop constructs (for, while, do-while)",
        "Implement basic conditional statements",
        "Create simple classes and objects",
        "Understand method overloading and overriding"
      ],
      estimatedTime: "4-6 hours",
      difficulty: "Beginner"
    },
    2: {
      title: "Java Fundamentals Deep Dive",
      description: "Continue with Java fundamentals and OOP concepts",
      week: "Week 1-4: Foundations and Core Development",
      category: "Java Basics to Advanced",
      tasks: [
        "Master inheritance and polymorphism",
        "Practice encapsulation and abstraction",
        "Work with interfaces and abstract classes",
        "Understand static keywords and final modifiers",
        "Build a simple calculator application"
      ],
      estimatedTime: "4-6 hours",
      difficulty: "Beginner"
    },
    3: {
      title: "Collections Framework - Lists",
      description: "Learn collections framework focusing on Lists",
      week: "Week 1-4: Foundations and Core Development",
      category: "Java Basics to Advanced",
      tasks: [
        "Understand ArrayList vs LinkedList",
        "Practice List operations (add, remove, search)",
        "Implement custom sorting with Comparator",
        "Work with iterators and enhanced for loops",
        "Build a task management system using Lists"
      ],
      estimatedTime: "5-7 hours",
      difficulty: "Intermediate"
    }
  };

  const getCurrentDayData = () => {
    return roadmapData[currentDay] || roadmapData[1];
  };

  const toggleTask = (taskIndex) => {
    const taskKey = `${currentDay}-${taskIndex}`;
    const newCompleted = new Set(completedTasks);
    
    if (newCompleted.has(taskKey)) {
      newCompleted.delete(taskKey);
    } else {
      newCompleted.add(taskKey);
    }
    
    setCompletedTasks(newCompleted);
  };

  const getProgressPercentage = () => {
    const dayData = getCurrentDayData();
    const dayTasks = dayData.tasks.length;
    const completedDayTasks = dayData.tasks.filter((_, index) => 
      completedTasks.has(`${currentDay}-${index}`)
    ).length;
    
    return Math.round((completedDayTasks / dayTasks) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const dayData = getCurrentDayData();
  const progress = getProgressPercentage();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Current Day</p>
                <p className="text-3xl font-bold">{currentDay}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Daily Progress</p>
                <p className="text-3xl font-bold">{progress}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Streak</p>
                <p className="text-3xl font-bold">{streak} days</p>
              </div>
              <Star className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              disabled={currentDay === 1}
            >
              Previous Day
            </button>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Day {currentDay}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{dayData.week}</p>
            </div>
            <button
              onClick={() => setCurrentDay(Math.min(90, currentDay + 1))}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              disabled={currentDay === 90}
            >
              Next Day
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {dayData.title}
                </CardTitle>
                <Badge className={getDifficultyColor(dayData.difficulty)}>
                  {dayData.difficulty}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{dayData.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{progress}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="space-y-3 mt-6">
                  {dayData.tasks.map((task, index) => {
                    const isCompleted = completedTasks.has(`${currentDay}-${index}`);
                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                          isCompleted
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => toggleTask(index)}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span
                          className={`flex-1 ${
                            isCompleted
                              ? 'text-green-700 dark:text-green-300 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Today's Focus</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Category</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{dayData.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Estimated Time</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{dayData.estimatedTime}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Difficulty</h4>
                  <Badge className={getDifficultyColor(dayData.difficulty)}>
                    {dayData.difficulty}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Take breaks every 25 minutes</p>
                <p>• Practice coding along with reading</p>
                <p>• Don't hesitate to ask for help</p>
                <p>• Review previous concepts regularly</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyRoadmap;
