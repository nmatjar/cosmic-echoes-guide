import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/engine/userProfile';
import { ComprehensiveAnalysis } from '@/engine/types';

export interface CloudProfile {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time?: string;
  birth_place?: string;
  analysis_results?: ComprehensiveAnalysis;
  created_at: string;
  updated_at: string;
}

export class CloudProfileManager {
  /**
   * Fetch user profile from Supabase
   */
  static async fetchUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Convert CloudProfile to UserProfile format
      const userProfile: UserProfile = {
        id: data.id,
        name: data.name,
        birthData: {
          date: data.birth_date,
          time: data.birth_time || undefined,
          place: data.birth_place || undefined,
        },
        analysis: (data.analysis_results as ComprehensiveAnalysis) || {},
        pin: '', // PIN is not stored in cloud for security
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return userProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }

  /**
   * Save user profile to Supabase
   */
  static async saveUserProfile(profile: UserProfile): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const cloudProfile = {
        user_id: user.id,
        name: profile.name,
        birth_date: profile.birthData.date,
        birth_time: profile.birthData.time,
        birth_place: profile.birthData.place,
        analysis_results: JSON.parse(JSON.stringify(profile.analysis)),
      };

      // Try to update existing profile first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(cloudProfile)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
          return false;
        }
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert([cloudProfile]);

        if (error) {
          console.error('Error creating profile:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in saveUserProfile:', error);
      return false;
    }
  }

  /**
   * Delete user profile from Supabase
   */
  static async deleteUserProfile(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUserProfile:', error);
      return false;
    }
  }

  /**
   * Sync local profile with cloud
   */
  static async syncWithCloud(localProfile: UserProfile): Promise<UserProfile | null> {
    try {
      // Save to cloud
      const saveSuccess = await this.saveUserProfile(localProfile);
      
      if (!saveSuccess) {
        return null;
      }

      // Fetch updated profile from cloud
      return await this.fetchUserProfile();
    } catch (error) {
      console.error('Error syncing with cloud:', error);
      return null;
    }
  }
}