
import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Target, Clock, Zap, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useFocusTasks, useCreateFocusTask, useDeleteFocusTask } from '@/hooks/useAdminContent';
import { useAuth } from '@/hooks/useAuth';

const DistractionAvoidance = () => {
  const { isAdmin } = useAuth();
  const { data: focusTasks = [] } = useFocusTasks();
  const createTaskMutation = useCreateFocusTask();
  const deleteTaskMutation = useDeleteFocusTask();

  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    duration_minutes: 25,
    difficulty: 'Medium',
    category: 'productivity',
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Could add notification here
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTask ? selectedTask.duration_minutes * 60 : 25 * 60);
  };

  const selectTask = (task: any) => {
    setSelectedTask(task);
    setTimeLeft(task.duration_minutes * 60);
    setIsRunning(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const progress = selectedTask 
    ? ((selectedTask.duration_minutes * 60 - timeLeft) / (selectedTask.duration_minutes * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) return;
    
    try {
      await createTaskMutation.mutateAsync(taskForm);
      setTaskForm({
        title: '',
        description: '',
        duration_minutes: 25,
        difficulty: 'Medium',
        category: 'productivity',
      });
      setShowAddTask(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setTimeLeft(25 * 60);
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Focus Tools</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Stay focused and productive with our distraction-free timer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Timer className="h-6 w-6" />
              <span>Focus Timer</span>
            </CardTitle>
            {selectedTask && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
                <div className="flex justify-center space-x-2">
                  <Badge className={getDifficultyColor(selectedTask.difficulty)}>
                    {selectedTask.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {selectedTask.category}
                  </Badge>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">
                {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="w-full h-3" />
            </div>

            <div className="flex justify-center space-x-4">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg" className="bg-green-500 hover:bg-green-600">
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={handlePause} size="lg" variant="outline">
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} size="lg" variant="outline">
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Focus Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Focus Tasks</span>
              </CardTitle>
              {isAdmin && (
                <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Focus Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={taskForm.title}
                          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                          placeholder="e.g., Deep Learning Session"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={taskForm.description}
                          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                          placeholder="Describe the focus task..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration (minutes)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={taskForm.duration_minutes}
                            onChange={(e) => setTaskForm({ ...taskForm, duration_minutes: parseInt(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select value={taskForm.difficulty} onValueChange={(value) => setTaskForm({ ...taskForm, difficulty: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={taskForm.category} onValueChange={(value) => setTaskForm({ ...taskForm, category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="productivity">Productivity</SelectItem>
                            <SelectItem value="learning">Learning</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="analytical">Analytical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateTask} disabled={!taskForm.title.trim()}>
                        Add Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {focusTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTask?.id === task.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => selectTask(task)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{task.duration_minutes}min</span>
                        </Badge>
                        <Badge variant="outline">{task.category}</Badge>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {focusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No focus tasks available. {isAdmin && 'Add some tasks to get started!'}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Focus Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Remove Distractions</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Close unnecessary tabs, put your phone away, and create a clean workspace.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Take Breaks</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Use the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Stay Hydrated</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Keep water nearby and maintain good posture to stay alert and focused.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistractionAvoidance;
