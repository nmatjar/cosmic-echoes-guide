
import { ComprehensiveAnalysis } from './types';

export interface UserProfile {
  id: string; 
  name: string; 
  birthData: {
    date: string; // ISO 8601 string
    time?: string;
    place?: string;
  };
  analysis: ComprehensiveAnalysis;
  pin: string; // 4-6 digit PIN for profile security
  isPublic?: boolean; // Added for public profile visibility
  subscriptionPlan?: 'free' | 'daily' | 'monthly'; // Added for subscription plan
  createdAt: string; 
  updatedAt: string; 
}
