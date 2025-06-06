
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Motivational Tips hooks
export const useMotivationalTips = () => {
  return useQuery({
    queryKey: ['motivational-tips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motivational_tips')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tip, category }: { tip: string; category: string }) => {
      const { data, error } = await supabase
        .from('motivational_tips')
        .insert({ tip, category })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivational-tips'] });
      toast.success('Tip added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add tip');
      console.error('Error adding tip:', error);
    },
  });
};

export const useDeleteTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('motivational_tips')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivational-tips'] });
      toast.success('Tip removed successfully!');
    },
    onError: (error) => {
      toast.error('Failed to remove tip');
      console.error('Error removing tip:', error);
    },
  });
};

// Ambient Sounds hooks
export const useAmbientSounds = () => {
  return useQuery({
    queryKey: ['ambient-sounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ambient_sounds')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAmbientSound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, icon, color }: { name: string; icon: string; color: string }) => {
      const { data, error } = await supabase
        .from('ambient_sounds')
        .insert({ name, icon, color })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambient-sounds'] });
      toast.success('Ambient sound added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add ambient sound');
      console.error('Error adding ambient sound:', error);
    },
  });
};

// Focus Tasks hooks
export const useFocusTasks = () => {
  return useQuery({
    queryKey: ['focus-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('focus_tasks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateFocusTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, duration_minutes, difficulty, category }: {
      title: string;
      description: string;
      duration_minutes: number;
      difficulty: string;
      category: string;
    }) => {
      const { data, error } = await supabase
        .from('focus_tasks')
        .insert({ title, description, duration_minutes, difficulty, category })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-tasks'] });
      toast.success('Focus task added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add focus task');
      console.error('Error adding focus task:', error);
    },
  });
};

export const useDeleteFocusTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('focus_tasks')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-tasks'] });
      toast.success('Focus task removed successfully!');
    },
    onError: (error) => {
      toast.error('Failed to remove focus task');
      console.error('Error removing focus task:', error);
    },
  });
};

// User Achievements hooks
export const useUserAchievements = (userId?: string) => {
  return useQuery({
    queryKey: ['user-achievements', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useCreateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, achievementName, achievementDescription, achievementType }: {
      userId: string;
      achievementName: string;
      achievementDescription: string;
      achievementType: string;
    }) => {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_name: achievementName,
          achievement_description: achievementDescription,
          achievement_type: achievementType,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', userId] });
    },
  });
};
