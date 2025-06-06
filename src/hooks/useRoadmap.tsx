import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRoadmap = () => {
  return useQuery({
    queryKey: ['roadmap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_roadmap')
        .select('*')
        .order('day_number');

      if (error) throw error;
      return data;
    },
  });
};

export const useUserProgress = (userId?: string) => {
  return useQuery({
    queryKey: ['user-progress', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('day_number');

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUserStreak = (userId?: string) => {
  return useQuery({
    queryKey: ['user-streak', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, dayNumber, completedTasks, completionPercentage }: {
      userId: string;
      dayNumber: number;
      completedTasks: number[];
      completionPercentage: number;
    }) => {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          day_number: dayNumber,
          completed_tasks: completedTasks,
          completion_percentage: completionPercentage,
          completed_at: completionPercentage === 100 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,day_number'
        })
        .select()
        .single();

      if (error) throw error;

      // Update streak if day is completed
      if (completionPercentage === 100) {
        await updateStreak(userId);
      }

      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-streak', userId] });
      toast.success('Progress updated!');
    },
    onError: (error) => {
      toast.error('Failed to update progress');
      console.error('Error updating progress:', error);
    },
  });
};

const updateStreak = async (userId: string) => {
  const { data: currentStreak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  const today = new Date().toDateString();
  const lastActivityDate = currentStreak?.last_activity_date ? new Date(currentStreak.last_activity_date).toDateString() : null;

  let newCurrentStreak = 1;
  if (lastActivityDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivityDate === yesterday.toDateString()) {
      newCurrentStreak = (currentStreak?.current_streak || 0) + 1;
    } else if (lastActivityDate === today) {
      newCurrentStreak = currentStreak?.current_streak || 1;
    }
  }

  const newLongestStreak = Math.max(newCurrentStreak, currentStreak?.longest_streak || 0);

  await supabase
    .from('user_streaks')
    .upsert({
      user_id: userId,
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });
};
