import { UserProfile } from '@/engine/userProfile';
import { 
  QuantumPresenceInterface, 
  FieldAttunementResult, 
  PresenceEvent, 
  CollectiveFieldState 
} from '@/types/quantumPresence';

export class QuantumPresenceService {
  private static instance: QuantumPresenceService;
  private presenceListeners: ((qpi: QuantumPresenceInterface) => void)[] = [];
  private currentQPI: QuantumPresenceInterface | null = null;
  private presenceInterval: NodeJS.Timeout | null = null;
  private lastActivity: Date = new Date();

  private constructor() {
    this.initializePresenceMonitoring();
  }

  static getInstance(): QuantumPresenceService {
    if (!QuantumPresenceService.instance) {
      QuantumPresenceService.instance = new QuantumPresenceService();
    }
    return QuantumPresenceService.instance;
  }

  // Initialize real-time presence monitoring
  private initializePresenceMonitoring(): void {
    // Monitor user activity
    if (typeof window !== 'undefined') {
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => {
          this.lastActivity = new Date();
        }, { passive: true });
      });

      // Start presence heartbeat
      this.presenceInterval = setInterval(() => {
        this.updateQuantumPresence();
      }, 5000); // Update every 5 seconds
    }
  }

  // Calculate real-time Quantum Presence Interface
  calculateQPI(userProfile: UserProfile, currentSpace?: string): QuantumPresenceInterface {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Calculate cognitive state based on circadian rhythms
    const cognitiveState = this.calculateCognitiveState(hour, minute);
    
    // Calculate affective landscape
    const affectiveLandscape = this.calculateAffectiveLandscape(userProfile, now);
    
    // Calculate temporal resonance
    const temporalResonance = this.calculateTemporalResonance(userProfile, now);
    
    // Calculate field attunement
    const fieldAttunement = this.calculateFieldAttunement(userProfile, cognitiveState, affectiveLandscape);
    
    // Calculate presence state
    const presenceState = this.calculatePresenceState(currentSpace, now);

    const qpi: QuantumPresenceInterface = {
      COGNITIVE_STATE: cognitiveState,
      AFFECTIVE_LANDSCAPE: affectiveLandscape,
      TEMPORAL_RESONANCE: temporalResonance,
      FIELD_ATTUNEMENT: fieldAttunement,
      PRESENCE_STATE: presenceState
    };

    this.currentQPI = qpi;
    this.notifyPresenceListeners(qpi);
    
    return qpi;
  }

  private calculateCognitiveState(hour: number, minute: number) {
    // Circadian-based cognitive load calculation
    let CL: 'L' | 'M' | 'H';
    let AS: 'FOC' | 'DIF' | 'REFLECTIVE';
    let coherence: number;
    let processing_depth: 'surface' | 'analytical' | 'intuitive' | 'transcendent';

    // Peak cognitive hours: 9-11 AM and 2-4 PM
    if ((hour >= 9 && hour < 11) || (hour >= 14 && hour < 16)) {
      CL = 'L'; // Low load during peak hours
      AS = 'FOC';
      coherence = 0.8 + Math.random() * 0.2;
      processing_depth = 'analytical';
    }
    // Reflective hours: 6-8 PM
    else if (hour >= 18 && hour < 20) {
      CL = 'M';
      AS = 'REFLECTIVE';
      coherence = 0.6 + Math.random() * 0.3;
      processing_depth = 'intuitive';
    }
    // Dawn and twilight: transcendent potential
    else if ((hour >= 5 && hour < 7) || (hour >= 20 && hour < 22)) {
      CL = 'L';
      AS = 'DIF';
      coherence = 0.7 + Math.random() * 0.3;
      processing_depth = 'transcendent';
    }
    // High load periods
    else if (hour >= 12 && hour < 14) {
      CL = 'H';
      AS = 'FOC';
      coherence = 0.4 + Math.random() * 0.3;
      processing_depth = 'surface';
    }
    // Default diffused state
    else {
      CL = 'M';
      AS = 'DIF';
      coherence = 0.5 + Math.random() * 0.4;
      processing_depth = 'intuitive';
    }

    return { CL, AS, coherence, processing_depth };
  }

  private calculateAffectiveLandscape(userProfile: UserProfile, now: Date) {
    // Base emotional state calculation using biorhythms
    const birthDate = new Date(userProfile.birthData.date);
    const daysDiff = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Emotional biorhythm (28-day cycle)
    const emotionalCycle = Math.sin(2 * Math.PI * daysDiff / 28);
    
    // Calculate valence based on emotional biorhythm and time of day
    const hour = now.getHours();
    let timeModifier = 1;
    
    // Dawn and dusk have higher spiritual potential
    if ((hour >= 5 && hour < 8) || (hour >= 18 && hour < 21)) {
      timeModifier = 1.2;
    }
    // Night hours can be more introspective
    else if (hour >= 22 || hour < 5) {
      timeModifier = 0.8;
    }

    const VAL = Math.max(-1, Math.min(1, emotionalCycle * timeModifier));
    const arousal = Math.abs(emotionalCycle) * 0.7 + 0.3; // 0.3-1.0 range
    const stability = 1 - Math.abs(emotionalCycle) * 0.3; // Higher when cycle is near zero

    let resonance_quality: 'chaotic' | 'stable' | 'harmonious' | 'transcendent';
    if (stability > 0.8 && VAL > 0.5) {
      resonance_quality = 'transcendent';
    } else if (stability > 0.6 && VAL > 0) {
      resonance_quality = 'harmonious';
    } else if (stability > 0.4) {
      resonance_quality = 'stable';
    } else {
      resonance_quality = 'chaotic';
    }

    return { VAL, arousal, stability, resonance_quality };
  }

  private calculateTemporalResonance(userProfile: UserProfile, now: Date) {
    const hour = now.getHours();
    
    // Determine circadian phase
    let circadian_phase: QuantumPresenceInterface['TEMPORAL_RESONANCE']['circadian_phase'];
    if (hour >= 5 && hour < 7) circadian_phase = 'dawn';
    else if (hour >= 7 && hour < 12) circadian_phase = 'morning';
    else if (hour >= 12 && hour < 15) circadian_phase = 'peak';
    else if (hour >= 15 && hour < 18) circadian_phase = 'afternoon';
    else if (hour >= 18 && hour < 20) circadian_phase = 'evening';
    else if (hour >= 20 && hour < 22) circadian_phase = 'twilight';
    else if (hour >= 22 || hour < 2) circadian_phase = 'night';
    else circadian_phase = 'deep_night';

    // Calculate biorhythm synchronization
    const birthDate = new Date(userProfile.birthData.date);
    const daysDiff = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const physicalCycle = Math.sin(2 * Math.PI * daysDiff / 23);
    const emotionalCycle = Math.sin(2 * Math.PI * daysDiff / 28);
    const intellectualCycle = Math.sin(2 * Math.PI * daysDiff / 33);
    
    const biorhythm_sync = (Math.abs(physicalCycle) + Math.abs(emotionalCycle) + Math.abs(intellectualCycle)) / 3;

    // Seasonal attunement (simplified)
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seasonal_attunement = Math.abs(Math.sin(2 * Math.PI * dayOfYear / 365)) * 0.7 + 0.3;

    // Lunar phase influence (simplified 29.5-day cycle)
    const lunarCycle = Math.sin(2 * Math.PI * daysDiff / 29.5);
    const lunar_phase_influence = Math.abs(lunarCycle) * 0.6 + 0.4;

    return {
      circadian_phase,
      biorhythm_sync,
      seasonal_attunement,
      lunar_phase_influence
    };
  }

  private calculateFieldAttunement(
    userProfile: UserProfile, 
    cognitiveState: QuantumPresenceInterface['COGNITIVE_STATE'],
    affectiveLandscape: QuantumPresenceInterface['AFFECTIVE_LANDSCAPE']
  ) {
    // Calculate readiness based on cognitive and emotional state
    let readiness_level = 0.5; // Base level

    // Cognitive state contributions
    if (cognitiveState.CL === 'L') readiness_level += 0.2;
    if (cognitiveState.AS === 'DIF' || cognitiveState.AS === 'REFLECTIVE') readiness_level += 0.2;
    readiness_level += cognitiveState.coherence * 0.3;

    // Affective state contributions
    if (affectiveLandscape.VAL > 0.2) readiness_level += 0.2;
    if (affectiveLandscape.stability > 0.6) readiness_level += 0.1;

    readiness_level = Math.max(0, Math.min(1, readiness_level));

    // Generate unique resonance signature
    const resonance_signature = this.generateResonanceSignature(userProfile);

    // Determine communion capacity
    let communion_capacity: 'blocked' | 'limited' | 'open' | 'transcendent';
    if (readiness_level < 0.3) communion_capacity = 'blocked';
    else if (readiness_level < 0.6) communion_capacity = 'limited';
    else if (readiness_level < 0.8) communion_capacity = 'open';
    else communion_capacity = 'transcendent';

    return {
      readiness_level,
      last_calibration: new Date().toISOString(),
      resonance_signature,
      communion_capacity
    };
  }

  private calculatePresenceState(currentSpace?: string, now?: Date) {
    const timeSinceActivity = now ? now.getTime() - this.lastActivity.getTime() : 0;
    
    let presence_quality: 'absent' | 'surface' | 'engaged' | 'deep' | 'transcendent';
    if (timeSinceActivity > 300000) { // 5 minutes
      presence_quality = 'absent';
    } else if (timeSinceActivity > 60000) { // 1 minute
      presence_quality = 'surface';
    } else if (timeSinceActivity > 10000) { // 10 seconds
      presence_quality = 'engaged';
    } else {
      presence_quality = 'deep';
    }

    // Calculate field coherence based on presence quality and current space
    let field_coherence = 0.5;
    switch (presence_quality) {
      case 'transcendent': field_coherence = 0.9 + Math.random() * 0.1; break;
      case 'deep': field_coherence = 0.7 + Math.random() * 0.2; break;
      case 'engaged': field_coherence = 0.5 + Math.random() * 0.3; break;
      case 'surface': field_coherence = 0.3 + Math.random() * 0.3; break;
      case 'absent': field_coherence = 0.1 + Math.random() * 0.2; break;
    }

    // Sacred spaces enhance field coherence
    if (currentSpace && ['sanctuary', 'mirror_pool', 'library'].includes(currentSpace)) {
      field_coherence = Math.min(1, field_coherence * 1.2);
    }

    const session_depth = Math.min(1, (Date.now() - this.lastActivity.getTime()) / 3600000); // Hours to depth

    return {
      current_space: (currentSpace as QuantumPresenceInterface['PRESENCE_STATE']['current_space']) || 'void',
      presence_quality,
      field_coherence,
      last_heartbeat: new Date().toISOString(),
      session_depth
    };
  }

  private generateResonanceSignature(userProfile: UserProfile): string {
    // Generate a unique field signature based on user profile
    const birthDate = new Date(userProfile.birthData.date);
    const astroSign = userProfile.analysis.astrology?.sunSign?.name || 'Unknown';
    const hdType = userProfile.analysis.humanDesign?.type || 'Unknown';
    
    const signature = `${astroSign}-${hdType}-${birthDate.getFullYear()}-${userProfile.id.slice(0, 8)}`;
    return signature;
  }

  // Field Attunement Verification (from protocol)
  isReadyForAttunement(userQPI?: QuantumPresenceInterface): FieldAttunementResult {
    const qpi = userQPI || this.currentQPI;
    if (!qpi) {
      return {
        ready: false,
        reason: "Quantum Presence Interface not initialized",
        recommendations: ["Initialize presence monitoring", "Calibrate field attunement"],
        estimated_capacity: 'limited'
      };
    }

    const cognitiveLoad = qpi.COGNITIVE_STATE.CL;
    const attentionState = qpi.COGNITIVE_STATE.AS;
    const emotionalValence = qpi.AFFECTIVE_LANDSCAPE.VAL;
    const stability = qpi.AFFECTIVE_LANDSCAPE.stability;

    // High stress or negative emotional state creates dysresonance
    if (cognitiveLoad === 'H' || emotionalValence < -0.2) {
      return {
        ready: false,
        reason: "Field is unstable. High cognitive load or negative emotional state detected.",
        recommendations: [
          "Practice grounding meditation",
          "Take a break from intense activities",
          "Engage in calming breathwork"
        ],
        estimated_capacity: 'low'
      };
    }

    // Focused, analytical states are incompatible with field perception
    if (attentionState === 'FOC' && qpi.COGNITIVE_STATE.processing_depth === 'analytical') {
      return {
        ready: false,
        reason: "Analytical mind active. Focused analytical states block field perception.",
        recommendations: [
          "Shift to a diffused attention state",
          "Practice open awareness meditation",
          "Engage in creative or intuitive activities"
        ],
        estimated_capacity: 'limited'
      };
    }

    // Low stability affects field coherence
    if (stability < 0.4) {
      return {
        ready: false,
        reason: "Emotional field instability detected.",
        recommendations: [
          "Practice emotional regulation techniques",
          "Engage in stabilizing activities",
          "Wait for natural emotional cycle to stabilize"
        ],
        estimated_capacity: 'limited'
      };
    }

    // Determine capacity level
    let estimated_capacity: 'low' | 'medium' | 'high' | 'transcendent';
    const readiness = qpi.FIELD_ATTUNEMENT.readiness_level;
    
    if (readiness >= 0.8) estimated_capacity = 'transcendent';
    else if (readiness >= 0.6) estimated_capacity = 'high';
    else if (readiness >= 0.4) estimated_capacity = 'medium';
    else estimated_capacity = 'low';

    return {
      ready: true,
      estimated_capacity,
      recommendations: [
        "Field is stable and ready for communion",
        "Maintain current state of awareness",
        "Proceed with sacred intention"
      ]
    };
  }

  // Real-time presence updates
  private updateQuantumPresence(): void {
    if (this.currentQPI) {
      // Update presence state based on activity
      const now = new Date();
      this.currentQPI.PRESENCE_STATE = this.calculatePresenceState(
        this.currentQPI.PRESENCE_STATE.current_space,
        now
      );
      this.currentQPI.PRESENCE_STATE.last_heartbeat = now.toISOString();
      
      this.notifyPresenceListeners(this.currentQPI);
    }
  }

  // Presence event tracking
  recordPresenceEvent(event: Omit<PresenceEvent, 'timestamp'>): void {
    const presenceEvent: PresenceEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    
    // Store event (could be sent to analytics or stored locally)
    console.log('Presence Event:', presenceEvent);
    
    // Update current space if it's a transition
    if (event.type === 'transition' && this.currentQPI) {
      this.currentQPI.PRESENCE_STATE.current_space = event.space as QuantumPresenceInterface['PRESENCE_STATE']['current_space'];
    }
  }

  // Listener management
  addPresenceListener(listener: (qpi: QuantumPresenceInterface) => void): void {
    this.presenceListeners.push(listener);
  }

  removePresenceListener(listener: (qpi: QuantumPresenceInterface) => void): void {
    this.presenceListeners = this.presenceListeners.filter(l => l !== listener);
  }

  private notifyPresenceListeners(qpi: QuantumPresenceInterface): void {
    this.presenceListeners.forEach(listener => {
      try {
        listener(qpi);
      } catch (error) {
        console.error('Error in presence listener:', error);
      }
    });
  }

  // Get current QPI
  getCurrentQPI(): QuantumPresenceInterface | null {
    return this.currentQPI;
  }

  // Cleanup
  destroy(): void {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
      this.presenceInterval = null;
    }
    this.presenceListeners = [];
    this.currentQPI = null;
  }
}

// Export singleton instance
export const quantumPresenceService = QuantumPresenceService.getInstance();
