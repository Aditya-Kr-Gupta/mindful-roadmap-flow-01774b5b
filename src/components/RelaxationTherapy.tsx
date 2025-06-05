
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Waves, Cloud, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const RelaxationTherapy = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const breathingExercises = [
    {
      name: "4-7-8 Breathing",
      description: "Inhale for 4, hold for 7, exhale for 8",
      steps: ["Inhale (4s)", "Hold (7s)", "Exhale (8s)"],
      duration: [4, 7, 8]
    },
    {
      name: "Box Breathing",
      description: "Equal timing for all phases",
      steps: ["Inhale (4s)", "Hold (4s)", "Exhale (4s)", "Hold (4s)"],
      duration: [4, 4, 4, 4]
    },
    {
      name: "Simple Breathing",
      description: "Basic inhale and exhale",
      steps: ["Inhale (4s)", "Exhale (6s)"],
      duration: [4, 6]
    }
  ];

  const [selectedExercise, setSelectedExercise] = useState(breathingExercises[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const guidedMeditations = [
    {
      title: "Focus and Concentration",
      description: "Clear your mind for better learning",
      duration: "10 min",
      type: "focus"
    },
    {
      title: "Stress Relief",
      description: "Release tension and anxiety",
      duration: "15 min",
      type: "stress"
    },
    {
      title: "Energy Boost",
      description: "Revitalize for your next study session",
      duration: "8 min",
      type: "energy"
    }
  ];

  const ambientSounds = [
    { name: "Rain", icon: Cloud, color: "text-blue-500" },
    { name: "Ocean Waves", icon: Waves, color: "text-cyan-500" },
    { name: "Forest", icon: Leaf, color: "text-green-500" }
  ];

  useEffect(() => {
    let interval;
    if (isBreathing) {
      interval = setInterval(() => {
        setStepProgress((prev) => {
          const stepDuration = selectedExercise.duration[currentStep];
          const increment = 100 / (stepDuration * 10);
          
          if (prev + increment >= 100) {
            setCurrentStep((prevStep) => 
              (prevStep + 1) % selectedExercise.steps.length
            );
            return 0;
          }
          return prev + increment;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isBreathing, currentStep, selectedExercise]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && meditationTimer > 0) {
      interval = setInterval(() => {
        setMeditationTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, meditationTimer]);

  const startBreathing = () => {
    setIsBreathing(true);
    setCurrentStep(0);
    setStepProgress(0);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setCurrentStep(0);
    setStepProgress(0);
  };

  const startMeditation = (minutes) => {
    setMeditationTimer(minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentInstruction = () => {
    return selectedExercise.steps[currentStep];
  };

  const getBreathingAnimation = () => {
    const isInhale = selectedExercise.steps[currentStep].toLowerCase().includes('inhale');
    const scale = isInhale ? 'scale-125' : 'scale-100';
    return `transform transition-transform duration-1000 ${scale}`;
  };

  return (
    <div className="space-y-6">
      {/* Breathing Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Waves className="h-5 w-5 text-blue-500" />
            <span>Breathing Exercises</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose Exercise</label>
                <select
                  value={selectedExercise.name}
                  onChange={(e) => {
                    const exercise = breathingExercises.find(ex => ex.name === e.target.value);
                    setSelectedExercise(exercise);
                    stopBreathing();
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                >
                  {breathingExercises.map((exercise) => (
                    <option key={exercise.name} value={exercise.name}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                  {selectedExercise.name}
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {selectedExercise.description}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={isBreathing ? stopBreathing : startBreathing}
                  className="flex-1"
                >
                  {isBreathing ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={stopBreathing}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                className={`w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center ${getBreathingAnimation()}`}
              >
                <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
                  <Waves className="h-12 w-12 text-white" />
                </div>
              </div>
              
              {isBreathing && (
                <div className="text-center space-y-2">
                  <p className="text-xl font-medium text-gray-900 dark:text-white">
                    {getCurrentInstruction()}
                  </p>
                  <div className="w-64">
                    <Progress value={stepProgress} className="h-2" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guided Meditation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-purple-500" />
              <span>Guided Meditation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Timer Display */}
              {isTimerRunning && (
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {formatTime(meditationTimer)}
                  </div>
                  <p className="text-purple-700 dark:text-purple-300">
                    Keep breathing deeply and stay focused
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsTimerRunning(false)}
                    className="mt-4"
                  >
                    Stop Meditation
                  </Button>
                </div>
              )}
              
              {/* Quick Timer Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((minutes) => (
                  <Button
                    key={minutes}
                    variant="outline"
                    onClick={() => startMeditation(minutes)}
                    disabled={isTimerRunning}
                    className="h-12"
                  >
                    {minutes}m
                  </Button>
                ))}
              </div>
              
              {/* Guided Sessions */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Guided Sessions</h4>
                {guidedMeditations.map((meditation, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {meditation.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {meditation.description}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {meditation.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ambient Sounds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-green-500" />
              <span>Ambient Sounds</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {ambientSounds.map((sound) => {
                  const Icon = sound.icon;
                  return (
                    <div
                      key={sound.name}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-6 w-6 ${sound.color}`} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {sound.name}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                  Pro Tip
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Combine ambient sounds with breathing exercises for a deeper relaxation experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelaxationTherapy;
