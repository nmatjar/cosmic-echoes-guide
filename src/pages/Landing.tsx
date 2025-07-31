import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleStartJourney = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            CosmoFlow by ARCĀNUM
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-2">
            Ancient Wisdom, AI Insights
          </p>
          <p className="text-lg text-gray-300">
            Odkryj swój kosmiczny portret duszy
          </p>
        </div>

        {/* Video Section */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-sm border-purple-500/30 overflow-hidden">
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[70vh] object-cover"
                poster="/placeholder.svg"
                onClick={togglePlay}
              >
                <source src="/videos/wideowstep.mp4" type="video/mp4" />
                Twoja przeglądarka nie obsługuje odtwarzania wideo.
              </video>

              {/* Video Overlay */}
              <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {/* Play/Pause Button */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={togglePlay}
                      size="lg"
                      className="bg-purple-600/80 hover:bg-purple-700/80 text-white rounded-full w-20 h-20 flex items-center justify-center backdrop-blur-sm"
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </Button>
                  </div>
                )}

                {/* Controls */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={togglePlay}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      
                      <Button
                        onClick={restart}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>

                      <Button
                        onClick={toggleMute}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Gotowy na odkrycie swojego kosmicznego przeznaczenia?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Połącz 7 starożytnych systemów mądrości z nowoczesną sztuczną inteligencją 
              i stwórz swój unikalny portret duszy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleStartJourney}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🌟 Rozpocznij Swoją Podróż
            </Button>
            
            <p className="text-sm text-gray-400">
              Bezpłatne • Bez rejestracji • Natychmiastowy dostęp
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl">🔮</div>
              <h3 className="text-lg font-semibold text-white">Astrologia & Numerologia</h3>
              <p className="text-gray-400 text-sm">Odkryj swoje kosmiczne wpływy</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl">🧬</div>
              <h3 className="text-lg font-semibold text-white">Human Design & Bio-Rytmy</h3>
              <p className="text-gray-400 text-sm">Zrozum swoją unikalną energię</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl">🤖</div>
              <h3 className="text-lg font-semibold text-white">AI Insights</h3>
              <p className="text-gray-400 text-sm">Personalizowane rekomendacje</p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `
      }} />
    </div>
  );
};

export default Landing;
