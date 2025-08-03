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
  is_public: boolean;
  view_count: number;
  subscription_plan: string;
  subscription_status: string;
  subscription_ends_at?: string;
  stripe_customer_id?: string;
  receive_daily_emails: boolean; // Added for email notifications opt-in
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
        isPublic: data.is_public, // Map is_public from cloud to UserProfile
        subscriptionPlan: data.subscription_plan as UserProfile['subscriptionPlan'],
        receiveDailyEmails: data.receive_daily_emails, // Map receive_daily_emails
        role: data.role as UserProfile['role'], // Map role from cloud
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
        is_public: profile.isPublic ?? false, // Ensure is_public is saved
        subscription_plan: profile.subscriptionPlan ?? 'free',
        receive_daily_emails: profile.receiveDailyEmails ?? false, // Ensure receive_daily_emails is saved
        role: profile.role ?? 'user', // Ensure role is saved
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

  /**
   * Get public profile by ID (no authentication required)
   */
  static async getPublicProfile(profileId: string): Promise<UserProfile | null> {
    try {
      console.log('Fetching public profile for ID:', profileId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .eq('is_public', true)
        .maybeSingle();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      if (!data) {
        console.log('No public profile found for ID:', profileId);
        return null;
      }

      console.log('Found public profile:', data);

      // Convert CloudProfile to UserProfile format (excluding sensitive data)
      const userProfile: UserProfile = {
        id: data.id,
        name: data.name,
        birthData: {
          date: data.birth_date,
          time: data.birth_time || undefined,
          place: data.birth_place || undefined,
        },
        analysis: (data.analysis_results as ComprehensiveAnalysis) || {},
        pin: '', // Never expose PIN
        isPublic: data.is_public, // Map is_public from cloud to UserProfile
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return userProfile;
    } catch (error) {
      console.error('Error in getPublicProfile:', error);
      return null;
    }
  }

  /**
   * Track profile view and increment counter
   */
  static async trackProfileView(profileId: string, referrerSource?: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_profile_views', {
        profile_uuid: profileId,
        ref_source: referrerSource || null
      });

      if (error) {
        console.error('Error tracking profile view:', error);
      }
    } catch (error) {
      console.error('Error in trackProfileView:', error);
    }
  }

  /**
   * Update profile visibility setting
   */
  static async updateProfileVisibility(isPublic: boolean): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ is_public: isPublic })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile visibility:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateProfileVisibility:', error);
      return false;
    }
  }

  /**
   * Get profile analytics (for profile owner)
   */
  static async getProfileAnalytics(): Promise<{
    viewCount: number;
    recentViews: Array<{ viewed_at: string; referrer_source?: string }>;
  } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get profile with view count and ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, view_count')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Error fetching profile analytics:', profileError);
        return null;
      }

      // Get recent views
      const { data: views, error: viewsError } = await supabase
        .from('profile_views')
        .select('viewed_at, referrer_source')
        .eq('profile_id', profile.id)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (viewsError) {
        console.error('Error fetching recent views:', viewsError);
        return { viewCount: profile.view_count, recentViews: [] };
      }

      return {
        viewCount: profile.view_count,
        recentViews: views || []
      };
    } catch (error) {
      console.error('Error in getProfileAnalytics:', error);
      return null;
    }
  }
}
