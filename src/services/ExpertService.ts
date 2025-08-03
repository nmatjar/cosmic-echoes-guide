import { supabase } from '@/integrations/supabase/client';
import { Expert } from '@/engine/types';

export class ExpertService {
  /**
   * Fetches all active experts from Supabase.
   * @returns A promise that resolves to an array of Expert objects, or null if an error occurs.
   */
  static async getActiveExperts(): Promise<Expert[] | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching active experts:', error);
        return null;
      }

      return data as Expert[];
    } catch (error) {
      console.error('Error in getActiveExperts:', error);
      return null;
    }
  }

  /**
   * Fetches a single expert by ID.
   * @param expertId The ID of the expert to fetch.
   * @returns A promise that resolves to an Expert object, or null if not found or an error occurs.
   */
  static async getExpertById(expertId: string): Promise<Expert | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching expert with ID ${expertId}:`, error);
        return null;
      }

      return data as Expert;
    } catch (error) {
      console.error('Error in getExpertById:', error);
      return null;
    }
  }

  /**
   * Creates a new expert entry in Supabase.
   * @param expertData The data for the new expert.
   * @returns A promise that resolves to the created Expert object, or null if an error occurs.
   */
  static async createExpert(expertData: Omit<Expert, 'id' | 'created_at' | 'updated_at'>): Promise<Expert | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .insert([expertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating expert:', error);
        return null;
      }

      return data as Expert;
    } catch (error) {
      console.error('Error in createExpert:', error);
      return null;
    }
  }

  /**
   * Updates an existing expert entry in Supabase.
   * @param expertId The ID of the expert to update.
   * @param updates The fields to update.
   * @returns A promise that resolves to the updated Expert object, or null if an error occurs.
   */
  static async updateExpert(expertId: string, updates: Partial<Expert>): Promise<Expert | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .update(updates)
        .eq('id', expertId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating expert with ID ${expertId}:`, error);
        return null;
      }

      return data as Expert;
    } catch (error) {
      console.error('Error in updateExpert:', error);
      return null;
    }
  }

  /**
   * Fetches all experts from Supabase, regardless of their active status.
   * Useful for admin panels.
   * @returns A promise that resolves to an array of all Expert objects, or null if an error occurs.
   */
  static async getAllExperts(): Promise<Expert[] | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*');

      if (error) {
        console.error('Error fetching all experts:', error);
        return null;
      }

      return data as Expert[];
    } catch (error) {
      console.error('Error in getAllExperts:', error);
      return null;
    }
  }

  /**
   * Deletes an expert entry from Supabase.
   * @param expertId The ID of the expert to delete.
   * @returns A promise that resolves to true if successful, false otherwise.
   */
  static async deleteExpert(expertId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('experts')
        .delete()
        .eq('id', expertId);

      if (error) {
        console.error(`Error deleting expert with ID ${expertId}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteExpert:', error);
      return false;
    }
  }
}