
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash, Music, Target, Heart } from 'lucide-react';
import { useMotivationalTips, useCreateTip, useDeleteTip, useAmbientSounds, useCreateAmbientSound, useFocusTasks, useCreateFocusTask, useDeleteFocusTask } from '@/hooks/useAdminContent';

export const AdminContentManager = () => {
  const { data: tips = [] } = useMotivationalTips();
  const { data: sounds = [] } = useAmbientSounds();
  const { data: tasks = [] } = useFocusTasks();
  
  const createTipMutation = useCreateTip();
  const deleteTipMutation = useDeleteTip();
  const createSoundMutation = useCreateAmbientSound();
  const createTaskMutation = useCreateFocusTask();
  const deleteTaskMutation = useDeleteFocusTask();

  const [activeTab, setActiveTab] = useState('tips');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Tip form state
  const [tipForm, setTipForm] = useState({
    tip: '',
    category: 'motivation',
  });

  // Sound form state
  const [soundForm, setSoundForm] = useState({
    name: '',
    icon: 'Music',
    color: 'text-blue-500',
  });

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    duration_minutes: 25,
    difficulty: 'Medium',
    category: 'productivity',
  });

  const handleCreateTip = async () => {
    if (!tipForm.tip.trim()) return;
    
    try {
      await createTipMutation.mutateAsync(tipForm);
      setTipForm({ tip: '', category: 'motivation' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating tip:', error);
    }
  };

  const handleCreateSound = async () => {
    if (!soundForm.name.trim()) return;
    
    try {
      await createSoundMutation.mutateAsync(soundForm);
      setSoundForm({ name: '', icon: 'Music', color: 'text-blue-500' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating sound:', error);
    }
  };

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
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const tabs = [
    { id: 'tips', name: 'Motivational Tips', icon: Heart, count: tips.length },
    { id: 'sounds', name: 'Ambient Sounds', icon: Music, count: sounds.length },
    { id: 'tasks', name: 'Focus Tasks', icon: Target, count: tasks.length },
  ];

  const openCreateDialog = (type: string) => {
    setActiveTab(type);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
              <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Tables */}
      {activeTab === 'tips' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Motivational Tips</CardTitle>
              <Dialog open={isDialogOpen && activeTab === 'tips'} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openCreateDialog('tips')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tip
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Motivational Tip</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tip">Tip Content</Label>
                      <Textarea
                        id="tip"
                        value={tipForm.tip}
                        onChange={(e) => setTipForm({ ...tipForm, tip: e.target.value })}
                        placeholder="Enter motivational tip..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={tipForm.category} onValueChange={(value) => setTipForm({ ...tipForm, category: value })}>
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
                    </div>
                    <Button onClick={handleCreateTip} disabled={!tipForm.tip.trim()}>
                      Add Tip
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tip</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tips.map((tip) => (
                  <TableRow key={tip.id}>
                    <TableCell className="max-w-md truncate">{tip.tip}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                        {tip.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTipMutation.mutate(tip.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'sounds' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Ambient Sounds</CardTitle>
              <Dialog open={isDialogOpen && activeTab === 'sounds'} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openCreateDialog('sounds')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sound
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Ambient Sound</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="soundName">Sound Name</Label>
                      <Input
                        id="soundName"
                        value={soundForm.name}
                        onChange={(e) => setSoundForm({ ...soundForm, name: e.target.value })}
                        placeholder="e.g., Forest Sounds"
                      />
                    </div>
                    <div>
                      <Label htmlFor="soundIcon">Icon</Label>
                      <Select value={soundForm.icon} onValueChange={(value) => setSoundForm({ ...soundForm, icon: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Cloud">Cloud</SelectItem>
                          <SelectItem value="Waves">Waves</SelectItem>
                          <SelectItem value="Leaf">Leaf</SelectItem>
                          <SelectItem value="Zap">Zap</SelectItem>
                          <SelectItem value="Flame">Flame</SelectItem>
                          <SelectItem value="Wind">Wind</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="soundColor">Color</Label>
                      <Select value={soundForm.color} onValueChange={(value) => setSoundForm({ ...soundForm, color: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-blue-500">Blue</SelectItem>
                          <SelectItem value="text-green-500">Green</SelectItem>
                          <SelectItem value="text-purple-500">Purple</SelectItem>
                          <SelectItem value="text-orange-500">Orange</SelectItem>
                          <SelectItem value="text-red-500">Red</SelectItem>
                          <SelectItem value="text-cyan-500">Cyan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateSound} disabled={!soundForm.name.trim()}>
                      Add Sound
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sounds.map((sound) => (
                  <TableRow key={sound.id}>
                    <TableCell>{sound.name}</TableCell>
                    <TableCell>{sound.icon}</TableCell>
                    <TableCell>
                      <span className={`${sound.color} font-medium`}>●</span> {sound.color}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tasks' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Focus Tasks</CardTitle>
              <Dialog open={isDialogOpen && activeTab === 'tasks'} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openCreateDialog('tasks')}>
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
                      <Label htmlFor="taskTitle">Task Title</Label>
                      <Input
                        id="taskTitle"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="e.g., Deep Learning Session"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskDescription">Description</Label>
                      <Textarea
                        id="taskDescription"
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
                      <Label htmlFor="taskCategory">Category</Label>
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
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.duration_minutes} min</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-800'
                            : task.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {task.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>{task.category}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
