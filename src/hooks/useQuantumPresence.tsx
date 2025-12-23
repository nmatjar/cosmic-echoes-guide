import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile } from '@/engine/userProfile';
import { quantumPresenceService } from '@/services/quantumPresenceService';
import { earthAICommunionService } from '@/services/earthAICommunionService';
import { 
  QuantumPresenceInterface, 
  FieldAttunementResult, 
  EarthAIResponse,
  EarthAIQuery 
} from '@/types/quantumPresence';

interface UseQuantumPresenceOptions {
  userProfile?: UserProfile;
  currentSpace?: string;
  autoUpdate?: boolean;
  updateInterval?: number;
}

interface UseQuantumPresenceReturn {
  // Current state
  qpi: QuantumPresenceInterface | null;
  attunementResult: FieldAttunementResult | null;
  isReady: boolean;
  
  // Actions
  updatePresence: () => void;
  recordEvent: (type: 'enter' | 'exit' | 'transition' | 'deepening' | 'disturbance', space: string) => void;
  
  // Earth AI Communion
  performSacredQuery: (
    fieldId: EarthAIQuery['field_id'], 
    depthLevel?: 'surface' | 'medium' | 'deep' | 'transcendent',
    onChunk?: (chunk: string) => void
  ) => Promise<EarthAIResponse>;
  
  // Convenience methods
  getInnateGenius: (onChunk?: (chunk: string) => void) => Promise<EarthAIResponse>;
  getShadowPotential: (onChunk?: (chunk: string) => void) => Promise<EarthAIResponse>;
  getTemporalFlow: (onChunk?: (chunk: string) => void) => Promise<EarthAIResponse>;
  getSystemicNeed: (onChunk?: (chunk: string) => void) => Promise<EarthAIResponse>;
  getGeoculturalMap: (onChunk?: (chunk: string) => void) => Promise<EarthAIResponse>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export const useQuantumPresence = ({
  userProfile,
  currentSpace,
  autoUpdate = true,
  updateInterval = 5000
}: UseQuantumPresenceOptions = {}): UseQuantumPresenceReturn => {
  
  const [qpi, setQPI] = useState<QuantumPresenceInterface | null>(null);
  const [attunementResult, setAttunementResult] = useState<FieldAttunementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpaceRef = useRef<string | undefined>(currentSpace);

  // Update quantum presence
  const updatePresence = useCallback(() => {
    if (!userProfile) return;
    
    try {
      const newQPI = quantumPresenceService.calculateQPI(userProfile, currentSpace);
      setQPI(newQPI);
      
      const newAttunementResult = quantumPresenceService.isReadyForAttunement(newQPI);
      setAttunementResult(newAttunementResult);
      
      setError(null);
    } catch (err) {
      console.error('Error updating quantum presence:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [userProfile, currentSpace]);

  // Record presence events
  const recordEvent = useCallback((
    type: 'enter' | 'exit' | 'transition' | 'deepening' | 'disturbance', 
    space: string
  ) => {
    quantumPresenceService.recordPresenceEvent({
      type,
      space,
      quality_change: type === 'deepening' ? 0.1 : type === 'disturbance' ? -0.1 : 0,
      field_impact: type === 'deepening' ? 0.2 : type === 'disturbance' ? -0.2 : 0
    });
    
    // Update presence after recording event
    updatePresence();
  }, [updatePresence]);

  // Sacred query method
  const performSacredQuery = useCallback(async (
    fieldId: EarthAIQuery['field_id'],
    depthLevel: 'surface' | 'medium' | 'deep' | 'transcendent' = 'medium',
    onChunk?: (chunk: string) => void
  ): Promise<EarthAIResponse> => {
    if (!userProfile) {
      throw new Error('User profile required for sacred queries');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await earthAICommunionService.performSacredQuery(
        fieldId,
        userProfile,
        depthLevel,
        onChunk
      );
      
      // Update presence after communion
      updatePresence();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sacred query failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, updatePresence]);

  // Convenience methods for specific queries
  const getInnateGenius = useCallback((onChunk?: (chunk: string) => void) => 
    performSacredQuery('INNATE_GENIUS_SIGNATURE', 'deep', onChunk), [performSacredQuery]);

  const getShadowPotential = useCallback((onChunk?: (chunk: string) => void) => 
    performSacredQuery('UNEXPRESSED_SELF_POTENTIAL', 'deep', onChunk), [performSacredQuery]);

  const getTemporalFlow = useCallback((onChunk?: (chunk: string) => void) => 
    performSacredQuery('TEMPORAL_FLOW_VECTOR', 'medium', onChunk), [performSacredQuery]);

  const getSystemicNeed = useCallback((onChunk?: (chunk: string) => void) => 
    performSacredQuery('SYSTEMIC_NEED_RESONANCE', 'transcendent', onChunk), [performSacredQuery]);

  const getGeoculturalMap = useCallback((onChunk?: (chunk: string) => void) => 
    performSacredQuery('GEOCULTURAL_AMPLIFICATION_MAP', 'deep', onChunk), [performSacredQuery]);

  // Initialize and setup auto-update
  useEffect(() => {
    if (userProfile) {
      updatePresence();
      
      if (autoUpdate) {
        intervalRef.current = setInterval(updatePresence, updateInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [userProfile, autoUpdate, updateInterval, updatePresence]);

  // Handle space transitions
  useEffect(() => {
    if (currentSpace !== lastSpaceRef.current && lastSpaceRef.current !== undefined) {
      recordEvent('transition', currentSpace || 'void');
    }
    lastSpaceRef.current = currentSpace;
  }, [currentSpace, recordEvent]);

  // Setup presence listener for real-time updates
  useEffect(() => {
    const handlePresenceUpdate = (newQPI: QuantumPresenceInterface) => {
      setQPI(newQPI);
      
      const newAttunementResult = quantumPresenceService.isReadyForAttunement(newQPI);
      setAttunementResult(newAttunementResult);
    };

    quantumPresenceService.addPresenceListener(handlePresenceUpdate);

    return () => {
      quantumPresenceService.removePresenceListener(handlePresenceUpdate);
    };
  }, []);

  return {
    // Current state
    qpi,
    attunementResult,
    isReady: attunementResult?.ready ?? false,
    
    // Actions
    updatePresence,
    recordEvent,
    
    // Earth AI Communion
    performSacredQuery,
    getInnateGenius,
    getShadowPotential,
    getTemporalFlow,
    getSystemicNeed,
    getGeoculturalMap,
    
    // Loading states
    isLoading,
    error
  };
};

// Additional hook for presence visualization
export const usePresenceVisualization = (qpi: QuantumPresenceInterface | null) => {
  const getPresenceColor = useCallback(() => {
    if (!qpi) return 'text-gray-400';
    
    const quality = qpi.PRESENCE_STATE.presence_quality;
    switch (quality) {
      case 'transcendent': return 'text-cosmic-purple';
      case 'deep': return 'text-blue-400';
      case 'engaged': return 'text-green-400';
      case 'surface': return 'text-yellow-400';
      case 'absent': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  }, [qpi]);

  const getCoherenceColor = useCallback(() => {
    if (!qpi) return 'text-gray-400';
    
    const coherence = qpi.PRESENCE_STATE.field_coherence;
    if (coherence > 0.8) return 'text-cosmic-purple';
    if (coherence > 0.6) return 'text-blue-400';
    if (coherence > 0.4) return 'text-green-400';
    if (coherence > 0.2) return 'text-yellow-400';
    return 'text-red-400';
  }, [qpi]);

  const getReadinessIndicator = useCallback(() => {
    if (!qpi) return { icon: '⚫', color: 'text-gray-400', text: 'Offline' };
    
    const capacity = qpi.FIELD_ATTUNEMENT.communion_capacity;
    switch (capacity) {
      case 'transcendent': return { icon: '🌟', color: 'text-cosmic-purple', text: 'Transcendent' };
      case 'open': return { icon: '🔮', color: 'text-blue-400', text: 'Open' };
      case 'limited': return { icon: '🌙', color: 'text-yellow-400', text: 'Limited' };
      case 'blocked': return { icon: '🔒', color: 'text-red-400', text: 'Blocked' };
      default: return { icon: '⚫', color: 'text-gray-400', text: 'Unknown' };
    }
  }, [qpi]);

  const getCircadianPhaseIcon = useCallback(() => {
    if (!qpi) return '⚫';
    
    const phase = qpi.TEMPORAL_RESONANCE.circadian_phase;
    switch (phase) {
      case 'dawn': return '🌅';
      case 'morning': return '☀️';
      case 'peak': return '🔥';
      case 'afternoon': return '🌤️';
      case 'evening': return '🌇';
      case 'twilight': return '🌆';
      case 'night': return '🌙';
      case 'deep_night': return '✨';
      default: return '⚫';
    }
  }, [qpi]);

  return {
    getPresenceColor,
    getCoherenceColor,
    getReadinessIndicator,
    getCircadianPhaseIcon
  };
};
