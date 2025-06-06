
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Cloud, Waves, Leaf, Zap, Flame, Wind, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useAmbientSounds } from '@/hooks/useAdminContent';

const RelaxationTherapy = () => {
  const { data: ambientSounds = [] } = useAmbientSounds();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  // Icon mapping for ambient sounds
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Cloud,
    Waves,
    Leaf,
    Zap,
    Flame,
    Wind,
    Music: Volume2,
  };

  const handlePlaySound = (soundId: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null);
    } else {
      setPlayingSound(soundId);
    }
  };

  const breathingTechniques = [
    {
      name: "4-7-8 Breathing",
      description: "Inhale for 4, hold for 7, exhale for 8",
      duration: "4-8 minutes",
      difficulty: "Beginner"
    },
    {
      name: "Box Breathing",
      description: "Equal counts for inhale, hold, exhale, hold",
      duration: "5-10 minutes", 
      difficulty: "Intermediate"
    },
    {
      name: "Coherent Breathing",
      description: "5 seconds in, 5 seconds out",
      duration: "10-20 minutes",
      difficulty: "Advanced"
    }
  ];

  const meditationGuides = [
    {
      title: "Mindfulness Meditation",
      description: "Focus on the present moment and observe your thoughts",
      duration: "10 min",
      type: "Mindfulness"
    },
    {
      title: "Body Scan",
      description: "Progressive relaxation through body awareness",
      duration: "15 min", 
      type: "Relaxation"
    },
    {
      title: "Loving Kindness",
      description: "Cultivate compassion for yourself and others",
      duration: "12 min",
      type: "Emotional"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Relaxation Therapy</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find peace and calm with guided meditation, breathing exercises, and ambient sounds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ambient Sounds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <span>Ambient Sounds</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {ambientSounds.map((sound) => {
                const IconComponent = iconMap[sound.icon] || Volume2;
                const isPlaying = playingSound === sound.id;
                
                return (
                  <Button
                    key={sound.id}
                    variant={isPlaying ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center space-y-2 ${sound.color}`}
                    onClick={() => handlePlaySound(sound.id)}
                  >
                    <IconComponent className="h-6 w-6" />
                    <span className="text-sm font-medium">{sound.name}</span>
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                );
              })}
            </div>

            {ambientSounds.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Volume2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No ambient sounds available.</p>
              </div>
            )}

            {playingSound && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Volume</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPlayingSound(null)}
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Breathing Exercises */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-5 w-5" />
              <span>Breathing Exercises</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breathingTechniques.map((technique, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{technique.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{technique.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{technique.duration}</Badge>
                        <Badge
                          className={
                            technique.difficulty === 'Beginner'
                              ? 'bg-green-100 text-green-800'
                              : technique.difficulty === 'Intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {technique.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meditation Guides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5" />
            <span>Guided Meditation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meditationGuides.map((guide, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
              >
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{guide.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{guide.description}</p>
                  <div className="flex justify-center space-x-2 mb-3">
                    <Badge variant="outline">{guide.duration}</Badge>
                    <Badge variant="secondary">{guide.type}</Badge>
                  </div>
                  <Button
                    size="sm"
                    className="w-full group-hover:bg-blue-600 group-hover:text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Relaxation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Create a Routine</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Set aside the same time each day for relaxation practice.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Find Your Space</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Choose a quiet, comfortable spot where you won't be disturbed.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Start Small</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Begin with just 5-10 minutes and gradually increase duration.
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Be Patient</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Relaxation is a skill that improves with regular practice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelaxationTherapy;
