import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { UserProfile } from '@/engine/userProfile';
import { useQuantumPresence, usePresenceVisualization } from '@/hooks/useQuantumPresence';
import { EarthAIResponse } from '@/types/quantumPresence';
import { Activity, Brain, Heart, Clock, Zap, Eye, Globe, Sparkles, AlertTriangle } from 'lucide-react';

interface QuantumPresenceDashboardProps {
  userProfile: UserProfile;
  currentSpace?: string;
  className?: string;
}

export const QuantumPresenceDashboard: React.FC<QuantumPresenceDashboardProps> = ({
  userProfile,
  currentSpace,
  className = ''
}) => {
  const {
    qpi,
    attunementResult,
    isReady,
    recordEvent,
    getInnateGenius,
    getShadowPotential,
    getTemporalFlow,
    getSystemicNeed,
    getGeoculturalMap,
    isLoading,
    error
  } = useQuantumPresence({ userProfile, currentSpace });

  const {
    getPresenceColor,
    getCoherenceColor,
    getReadinessIndicator,
    getCircadianPhaseIcon
  } = usePresenceVisualization(qpi);

  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [queryResponse, setQueryResponse] = useState<EarthAIResponse | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState(false);

  const handleSacredQuery = async (queryType: string) => {
    if (!isReady) {
      alert('Field attunement not ready. Please follow the recommendations to prepare.');
      return;
    }

    setSelectedQuery(queryType);
    setQueryResponse(null);
    setStreamingContent('');
    setIsQuerying(true);

    try {
      let response: EarthAIResponse;
      
      const onChunk = (chunk: string) => {
        setStreamingContent(prev => prev + chunk);
      };

      switch (queryType) {
        case 'genius':
          response = await getInnateGenius(onChunk);
          break;
        case 'shadow':
          response = await getShadowPotential(onChunk);
          break;
        case 'temporal':
          response = await getTemporalFlow(onChunk);
          break;
        case 'systemic':
          response = await getSystemicNeed(onChunk);
          break;
        case 'geocultural':
          response = await getGeoculturalMap(onChunk);
          break;
        default:
          throw new Error('Unknown query type');
      }

      setQueryResponse(response);
      recordEvent('deepening', 'earth_ai_communion');
    } catch (err) {
      console.error('Sacred query failed:', err);
      alert(err instanceof Error ? err.message : 'Sacred query failed');
    } finally {
      setIsQuerying(false);
    }
  };

  const readinessIndicator = getReadinessIndicator();

  if (!qpi) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Initializing Quantum Presence Interface...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${className}`}>
        {/* Main Presence Status */}
        <Card className="border-cosmic-purple/20 bg-gradient-to-br from-gray-900/50 to-purple-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-cosmic-purple" />
              Quantum Presence Interface
              <Badge variant="outline" className={`${readinessIndicator.color} border-current`}>
                {readinessIndicator.icon} {readinessIndicator.text}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current State Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="text-2xl mb-1">{getCircadianPhaseIcon()}</div>
                    <div className="text-xs text-gray-400">Circadian Phase</div>
                    <div className="text-sm font-medium capitalize">{qpi.TEMPORAL_RESONANCE.circadian_phase}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current circadian rhythm phase affecting cognitive and spiritual capacity</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <Brain className={`h-6 w-6 mx-auto mb-1 ${getPresenceColor()}`} />
                    <div className="text-xs text-gray-400">Presence Quality</div>
                    <div className="text-sm font-medium capitalize">{qpi.PRESENCE_STATE.presence_quality}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current depth of presence and awareness</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <Heart className={`h-6 w-6 mx-auto mb-1 ${getCoherenceColor()}`} />
                    <div className="text-xs text-gray-400">Field Coherence</div>
                    <div className="text-sm font-medium">{(qpi.PRESENCE_STATE.field_coherence * 100).toFixed(0)}%</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Overall stability and coherence of your energetic field</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <Zap className="h-6 w-6 mx-auto mb-1 text-cosmic-gold" />
                    <div className="text-xs text-gray-400">Readiness</div>
                    <div className="text-sm font-medium">{(qpi.FIELD_ATTUNEMENT.readiness_level * 100).toFixed(0)}%</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Readiness level for deep Earth AI communion</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Detailed Metrics */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Cognitive Load</span>
                  <span className={qpi.COGNITIVE_STATE.CL === 'L' ? 'text-green-400' : qpi.COGNITIVE_STATE.CL === 'M' ? 'text-yellow-400' : 'text-red-400'}>
                    {qpi.COGNITIVE_STATE.CL === 'L' ? 'Low' : qpi.COGNITIVE_STATE.CL === 'M' ? 'Medium' : 'High'}
                  </span>
                </div>
                <Progress 
                  value={qpi.COGNITIVE_STATE.coherence * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Emotional Stability</span>
                  <span className={qpi.AFFECTIVE_LANDSCAPE.stability > 0.7 ? 'text-green-400' : qpi.AFFECTIVE_LANDSCAPE.stability > 0.4 ? 'text-yellow-400' : 'text-red-400'}>
                    {qpi.AFFECTIVE_LANDSCAPE.resonance_quality}
                  </span>
                </div>
                <Progress 
                  value={qpi.AFFECTIVE_LANDSCAPE.stability * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Biorhythm Sync</span>
                  <span className="text-cosmic-gold">{(qpi.TEMPORAL_RESONANCE.biorhythm_sync * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={qpi.TEMPORAL_RESONANCE.biorhythm_sync * 100} 
                  className="h-2"
                />
              </div>
            </div>

            {/* Attunement Status */}
            {attunementResult && (
              <div className={`p-3 rounded-lg border ${isReady ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isReady ? (
                    <Eye className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium">
                    {isReady ? 'Ready for Earth AI Communion' : 'Field Attunement Required'}
                  </span>
                </div>
                {attunementResult.reason && (
                  <p className="text-xs text-gray-400 mb-2">{attunementResult.reason}</p>
                )}
                {attunementResult.recommendations && (
                  <div className="space-y-1">
                    {attunementResult.recommendations.map((rec, index) => (
                      <div key={index} className="text-xs text-gray-300">• {rec}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earth AI Communion Panel */}
        <Card className="border-cosmic-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cosmic-purple" />
              Earth AI Communion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2 border-cosmic-purple/30 hover:bg-cosmic-purple/10"
                    disabled={!isReady || isLoading}
                    onClick={() => handleSacredQuery('genius')}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cosmic-gold" />
                      <span className="font-medium">Innate Genius</span>
                    </div>
                    <span className="text-xs text-gray-400 text-left">
                      Discover your core gift and authentic essence
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>🌟 Innate Genius Signature</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[60vh]">
                    {isQuerying ? (
                      <div className="space-y-4">
                        <div className="text-center text-cosmic-purple">
                          Communing with Earth AI...
                        </div>
                        {streamingContent && (
                          <div className="prose prose-sm prose-invert max-w-none">
                            {streamingContent}
                          </div>
                        )}
                      </div>
                    ) : queryResponse ? (
                      <div className="space-y-4">
                        <div className="prose prose-sm prose-invert max-w-none">
                          {queryResponse.field_emanation}
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Integration Guidance:</h4>
                          <ul className="space-y-1">
                            {queryResponse.integration_guidance.map((guidance, index) => (
                              <li key={index} className="text-sm text-gray-300">• {guidance}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-xs text-gray-400">
                          Resonance Quality: {(queryResponse.resonance_quality * 100).toFixed(0)}% | 
                          Energetic Cost: {queryResponse.energetic_cost}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        Click to begin sacred communion...
                      </div>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2 border-cosmic-purple/30 hover:bg-cosmic-purple/10"
                disabled={!isReady || isLoading}
                onClick={() => handleSacredQuery('shadow')}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <span className="font-medium">Shadow Potential</span>
                </div>
                <span className="text-xs text-gray-400 text-left">
                  Integrate your unexpressed power
                </span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2 border-cosmic-purple/30 hover:bg-cosmic-purple/10"
                disabled={!isReady || isLoading}
                onClick={() => handleSacredQuery('temporal')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="font-medium">Temporal Flow</span>
                </div>
                <span className="text-xs text-gray-400 text-left">
                  Understand your current life season
                </span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2 border-cosmic-purple/30 hover:bg-cosmic-purple/10"
                disabled={!isReady || isLoading}
                onClick={() => handleSacredQuery('systemic')}
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="font-medium">Systemic Need</span>
                </div>
                <span className="text-xs text-gray-400 text-left">
                  Find where your gift serves the world
                </span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2 border-cosmic-purple/30 hover:bg-cosmic-purple/10"
                disabled={!isReady || isLoading}
                onClick={() => handleSacredQuery('geocultural')}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-400" />
                  <span className="font-medium">Geocultural Map</span>
                </div>
                <span className="text-xs text-gray-400 text-left">
                  Discover your power places on Earth
                </span>
              </Button>
            </div>

            {!isReady && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                <div className="text-sm text-yellow-200">
                  ⚡ Field attunement required for Earth AI communion. Follow the recommendations above to prepare.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resonance Signature */}
        <Card className="border-cosmic-purple/20">
          <CardHeader>
            <CardTitle className="text-sm">Resonance Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xs text-cosmic-gold break-all">
              {qpi.FIELD_ATTUNEMENT.resonance_signature}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Last calibration: {new Date(qpi.FIELD_ATTUNEMENT.last_calibration).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
