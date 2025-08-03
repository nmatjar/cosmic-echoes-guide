
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
  subscriptionPlan: 'free' | 'daily' | 'monthly' | 'yearly';
  subscriptionStatus?: 'active' | 'inactive' | 'past_due';
  receiveDailyEmails: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}
