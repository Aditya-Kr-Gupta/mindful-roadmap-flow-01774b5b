
import React, { useState } from 'react';
import { Volume2, VolumeX, Waves, Leaf, Cloud, Zap, Flame, Wind, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAmbientSounds, useCreateAmbientSound } from '@/hooks/useAdminContent';
import { useAuth } from '@/hooks/useAuth';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Cloud,
  Waves,
  Leaf,
  Zap,
  Flame,
  Wind,
  Volume2,
};

const RelaxationTherapy = () => {
  const { isAdmin } = useAuth();
  const { data: ambientSounds = [] } = useAmbientSounds();
  const createSoundMutation = useCreateAmbientSound();

  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState([50]);
  const [showAddSound, setShowAddSound] = useState(false);
  
  const [soundForm, setSoundForm] = useState({
    name: '',
    icon: 'Volume2',
    color: 'text-blue-500',
  });

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      setActiveSound(null);
    } else {
      setActiveSound(soundId);
    }
  };

  const handleCreateSound = async () => {
    if (!soundForm.name.trim()) return;
    
    try {
      await createSoundMutation.mutateAsync(soundForm);
      setSoundForm({ name: '', icon: 'Volume2', color: 'text-blue-500' });
      setShowAddSound(false);
    } catch (error) {
      console.error('Error creating sound:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Relaxation Therapy</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find your peace with ambient sounds and breathing exercises
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ambient Sounds */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5" />
                  <span>Ambient Sounds</span>
                </CardTitle>
                {isAdmin && (
                  <Dialog open={showAddSound} onOpenChange={setShowAddSound}>
                    <DialogTrigger asChild>
                      <Button size="sm">
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
                              <SelectItem value="Volume2">Volume2</SelectItem>
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
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ambientSounds.map((sound) => {
                  const IconComponent = iconMap[sound.icon] || Volume2;
                  const isActive = activeSound === sound.id;
                  
                  return (
                    <button
                      key={sound.id}
                      onClick={() => toggleSound(sound.id)}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 group ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`mb-3 ${sound.color} ${isActive ? 'animate-pulse' : ''}`}>
                          <IconComponent className="h-8 w-8 mx-auto" />
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                          {sound.name}
                        </h3>
                        {isActive && (
                          <div className="mt-2">
                            <div className="flex items-center justify-center space-x-1">
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

                {ambientSounds.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                    <Volume2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No ambient sounds available. {isAdmin && 'Add some sounds to get started!'}</p>
                  </div>
                )}
              </div>

              {activeSound && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <VolumeX className="h-5 w-5 text-blue-600" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <Volume2 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600 min-w-[3rem]">
                      {volume[0]}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Breathing Exercise */}
        <div>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Breathing Exercise</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse" />
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Follow the circle's rhythm
                </p>
                <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Breathe In • Hold • Breathe Out
                </div>
              </div>
              
              <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
                Start Breathing Exercise
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Relaxation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">
                    Find Your Space
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Choose a quiet, comfortable environment free from distractions.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Regular Practice
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Consistency is key. Even 5-10 minutes daily can make a difference.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                    Listen to Your Body
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Pay attention to how different techniques affect your stress levels.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Relaxation Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Leaf className="h-6 w-6 text-green-500" />
              <span className="font-medium">4-7-8 Breathing</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Inhale 4, hold 7, exhale 8
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Waves className="h-6 w-6 text-blue-500" />
              <span className="font-medium">Progressive Relaxation</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tense and release muscles
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Cloud className="h-6 w-6 text-purple-500" />
              <span className="font-medium">Mindful Meditation</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Focus on the present moment
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelaxationTherapy;
