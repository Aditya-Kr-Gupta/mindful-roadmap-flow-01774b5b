
import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, AlertCircle, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

const DistractionAvoidance = () => {
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [focusTasks, setFocusTasks] = useState([
    { id: 1, text: 'Review Java fundamentals', completed: false, priority: 'high' },
    { id: 2, text: 'Practice coding exercises', completed: false, priority: 'medium' },
    { id: 3, text: 'Read documentation', completed: true, priority: 'low' },
  ]);

  const phases = {
    work: { duration: 25 * 60, name: 'Focus Time', color: 'text-red-500' },
    shortBreak: { duration: 5 * 60, name: 'Short Break', color: 'text-green-500' },
    longBreak: { duration: 15 * 60, name: 'Long Break', color: 'text-blue-500' },
  };

  const focusTips = [
    "Turn off notifications on your phone",
    "Close unnecessary browser tabs",
    "Use website blockers for social media",
    "Keep a clean, organized workspace",
    "Stay hydrated and take regular breaks",
    "Practice the two-minute rule for quick tasks"
  ];

  const distractionBlockers = [
    { name: "Social Media Block", description: "Block Facebook, Twitter, Instagram", active: false },
    { name: "YouTube Block", description: "Block video streaming sites", active: true },
    { name: "News Sites Block", description: "Block news and entertainment sites", active: false },
    { name: "Gaming Sites Block", description: "Block online games and gaming platforms", active: false },
  ];

  const [blockers, setBlockers] = useState(distractionBlockers);

  useEffect(() => {
    let interval;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    
    if (currentPhase === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      const nextPhase = (completedPomodoros + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setCurrentPhase(nextPhase);
      setPomodoroTime(phases[nextPhase].duration);
    } else {
      setCurrentPhase('work');
      setPomodoroTime(phases.work.duration);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPomodoroTime(phases[currentPhase].duration);
  };

  const toggleTask = (taskId) => {
    setFocusTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      text: 'New task',
      completed: false,
      priority: 'medium'
    };
    setFocusTasks(prev => [...prev, newTask]);
  };

  const toggleBlocker = (index) => {
    setBlockers(prev => prev.map((blocker, i) => 
      i === index ? { ...blocker, active: !blocker.active } : blocker
    ));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = phases[currentPhase].duration;
    const remaining = pomodoroTime;
    return ((total - remaining) / total) * 100;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'low': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pomodoro Timer */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-red-500" />
              <span>Pomodoro Timer</span>
            </div>
            <div className={`text-sm font-medium ${phases[currentPhase].color}`}>
              {phases[currentPhase].name}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-gray-900 dark:text-white">
                {formatTime(pomodoroTime)}
              </div>
              <Progress value={getProgress()} className="h-3" />
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={isRunning ? pauseTimer : startTimer}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetTimer} size="lg">
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{completedPomodoros}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {focusTasks.filter(task => task.completed).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Done</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {Math.floor((completedPomodoros * 25) / 60)}h {(completedPomodoros * 25) % 60}m
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Study Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span>Focus Tasks</span>
              </div>
              <Button variant="outline" size="sm" onClick={addTask}>
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {focusTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${getPriorityColor(task.priority)}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {task.text}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distraction Blockers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Distraction Blockers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blockers.map((blocker, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {blocker.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {blocker.description}
                    </p>
                  </div>
                  <Button
                    variant={blocker.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBlocker(index)}
                  >
                    {blocker.active ? 'Active' : 'Inactive'}
                  </Button>
                </div>
              ))}
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These are mock blockers. For real website blocking, consider browser extensions like StayFocusd or Cold Turkey.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Focus Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Enhancement Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {focusTips.map((tip, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistractionAvoidance;
