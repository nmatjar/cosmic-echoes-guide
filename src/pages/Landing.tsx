import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfiles } from "@/services/profileManager";

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
    // Check if there are existing profiles
    const existingProfiles = getProfiles();
    
    if (existingProfiles.length > 0) {
      // User has existing profiles - go to profile selection
      navigate('/');
    } else {
      // No existing profiles - go to profile creation
      navigate('/welcome');
    }
  };

  const handleCreateProfile = () => {
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
                poster="data:image/svg+xml,%3Csvg width='800' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231e1b4b'/%3E%3Cstop offset='50%25' style='stop-color:%233730a3'/%3E%3Cstop offset='100%25' style='stop-color:%231e40af'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23bg)'/%3E%3Ccircle cx='100' cy='80' r='2' fill='%23fbbf24' opacity='0.8'/%3E%3Ccircle cx='200' cy='120' r='1.5' fill='%2360a5fa' opacity='0.6'/%3E%3Ccircle cx='650' cy='90' r='1.5' fill='%23fbbf24' opacity='0.9'/%3E%3Cg transform='translate(400,180)'%3E%3Cpath d='M0,-20 C-10,-15 -10,0 0,8 C10,0 10,-15 0,-20 Z' fill='%23a855f7' opacity='0.8'/%3E%3Ccircle cx='0' cy='0' r='6' fill='%23a855f7'/%3E%3C/g%3E%3Ctext x='400' y='280' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='32' font-weight='bold'%3ECosmoFlow%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' fill='%23d1d5db' font-family='Arial' font-size='18'%3EAncient Wisdom, AI Insights%3C/text%3E%3Cg transform='translate(400,380)'%3E%3Ccircle cx='0' cy='0' r='25' fill='%23a855f7' opacity='0.8'/%3E%3Cpath d='M-8,-5 L8,0 L-8,5 Z' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E"
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

      {/* Comprehensive Features Section */}
      <div id="features-section" className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-32 left-20 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-64 right-32 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-48 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Main Features Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              7 Starożytnych Systemów Mądrości
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Połącz wiedzę tysięcy lat z mocą sztucznej inteligencji i odkryj swój unikalny kosmiczny portret duszy
            </p>
          </div>

          {/* Detailed Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Astrologia */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-6 hover:bg-black/30 transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="text-5xl">🌟</div>
                <h3 className="text-xl font-bold text-white">Astrologia Zachodnia</h3>
                <p className="text-gray-300 text-sm">
                  Analiza pozycji planet w momencie urodzenia. Odkryj swój znak zodiaku, ascendent, 
                  pozycje planet w domach astrologicznych i ich wpływ na Twoją osobowość.
                </p>
                <div className="text-xs text-purple-300">
                  ✨ Znak słoneczny • Ascendent • Domy astrologiczne • Aspekty planet
                </div>
              </div>
            </Card>

            {/* Numerologia */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-6 hover:bg-black/30 transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="text-5xl">🔢</div>
                <h3 className="text-xl font-bold text-white">Numerologia</h3>
                <p className="text-gray-300 text-sm">
                  Odkryj ukryte znaczenia liczb w Twoim życiu. Liczba życiowa, duszy, osobowości 
                  i przeznaczenia ujawnią Twoje najgłębsze cechy i potencjał.
                </p>
                <div className="text-xs text-purple-300">
                  ✨ Liczba życiowa • Liczba duszy • Liczba osobowości • Liczba przeznaczenia
                </div>
              </div>
            </Card>

            {/* Zodiak Chiński */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-6 hover:bg-black/30 transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="text-5xl">🐉</div>
                <h3 className="text-xl font-bold text-white">Zodiak Chiński</h3>
                <p className="text-gray-300 text-sm">
                  5000-letnia tradycja chińska. Twoje zwierzę roku, miesiąca, dnia i godziny 
                  wraz z elementami (metal, woda, drewno, ogień, ziemia) tworzą kompletny obraz.
                </p>
                <div className="text-xs text-purple-300">
                  ✨ Zwierzę roku • Element • Yin/Yang • Kompatybilność
                </div>
              </div>
            </Card>

            {/* Human Design */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-6 hover:bg-black/30 transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="text-5xl">⚡</div>
                <h3 className="text-xl font-bold text-white">Human Design</h3>
                <p className="text-gray-300 text-sm">
                  Nowoczesny system łączący astrologię, I-Ching, Kabałę i czakry. 
                  Odkryj swój typ energetyczny, strategię życiową i unikalny sposób funkcjonowania.
                </p>
                <div className="text-xs text-purple-300">
                  ✨ Typ energetyczny • Strategia • Autorytet • Profil
                </div>
              </div>
            </Card>

            {/* Kalendarz Majów */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-6 hover:bg-black/30 transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="text-5xl">🌅</div>
                <h3 className="text-xl font-bold text-white">Kalendarz Majów</h3>
                <p className="text-gray-300 text-sm">
                  Starożytna mądrość cywilizacji Majów. Twój znak Tzolkin, Kin i pozycja 
                  w 260-dniowym świętym kalendarzu ujawnią Twoją duchową misję.
                </p>
                <div className="text-xs text-purple-300">
                  ✨ Znak Tzolkin • Kin • Ton • Pieczęć • Kolor
                </div>
              </div>
            </Card>

            {/* Bio-Rytmy */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-6 hover:bg-black/30 transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="text-5xl">📊</div>
                <h3 className="text-xl font-bold text-white">Bio-Rytmy</h3>
                <p className="text-gray-300 text-sm">
                  Naukowe podejście do cyklów życiowych. Monitoruj swoje rytmy fizyczne, 
                  emocjonalne i intelektualne dla optymalnego planowania działań.
                </p>
                <div className="text-xs text-purple-300">
                  ✨ Rytm fizyczny • Rytm emocjonalny • Rytm intelektualny • Prognozy
                </div>
              </div>
            </Card>
          </div>

          {/* AI Integration Section */}
          <div className="text-center mb-16">
            <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-purple-500/30 p-8">
              <div className="space-y-6">
                <div className="text-6xl">🤖</div>
                <h3 className="text-3xl font-bold text-white">Sztuczna Inteligencja</h3>
                <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                  Nasze zaawansowane algorytmy AI analizują wszystkie 7 systemów jednocześnie, 
                  tworząc spersonalizowane insights, rekomendacje i prognozy dostosowane do Twojego unikalnego profilu.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-white">Personalizacja</h4>
                    <p className="text-sm text-gray-300">Rekomendacje dostosowane do Ciebie</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔮</div>
                    <h4 className="font-semibold text-white">Prognozy</h4>
                    <p className="text-sm text-gray-300">Przewidywania oparte na cyklach</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💡</div>
                    <h4 className="font-semibold text-white">Insights</h4>
                    <p className="text-sm text-gray-300">Głębokie analizy i odkrycia</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Project Values Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Nasze Wartości
              </h2>
              <p className="text-xl text-gray-200">
                CosmoFlow to więcej niż aplikacja - to misja demokratyzacji starożytnej mądrości
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/20 backdrop-blur-sm border-green-500/30 p-6 text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-bold text-white mb-2">Open Source</h3>
                <p className="text-gray-300 text-sm">
                  Kod dostępny dla wszystkich. Wierzymy w transparentność i współpracę społeczności.
                </p>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-green-500/30 p-6 text-center">
                <div className="text-4xl mb-4">🆓</div>
                <h3 className="text-lg font-bold text-white mb-2">Bezpłatny Dostęp</h3>
                <p className="text-gray-300 text-sm">
                  Starożytna mądrość powinna być dostępna dla każdego, niezależnie od statusu finansowego.
                </p>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-green-500/30 p-6 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-bold text-white mb-2">Prywatność</h3>
                <p className="text-gray-300 text-sm">
                  Twoje dane pozostają Twoje. Lokalne przechowywanie z opcjonalną synchronizacją w chmurze.
                </p>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-green-500/30 p-6 text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-lg font-bold text-white mb-2">Edukacja</h3>
                <p className="text-gray-300 text-sm">
                  Nie tylko wyniki, ale też zrozumienie. Ucz się o systemach, które Cię definiują.
                </p>
              </Card>
            </div>
          </div>

          {/* Open Source Development Plan */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Plan Rozwoju Open Source
              </h2>
              <p className="text-xl text-gray-200">
                Dołącz do naszej społeczności i pomóż kształtować przyszłość CosmoFlow
              </p>
            </div>

            <div className="space-y-8">
              {/* Phase 1 */}
              <Card className="bg-black/20 backdrop-blur-sm border-blue-500/30 p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Faza 1: Fundament (Q1 2025) ✅</h3>
                    <p className="text-gray-300 mb-4">
                      Podstawowe funkcjonalności i stabilna architektura
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Zrealizowane:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>✅ 7 systemów mądrości</li>
                          <li>✅ AI-powered insights</li>
                          <li>✅ Export do PDF</li>
                          <li>✅ Publiczne profile</li>
                          <li>✅ Responsywny design</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Technologie:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• React + TypeScript</li>
                          <li>• Supabase (auth + db)</li>
                          <li>• Tailwind CSS</li>
                          <li>• Vite + Modern tooling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Phase 2 */}
              <Card className="bg-black/20 backdrop-blur-sm border-yellow-500/30 p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Faza 2: Społeczność (Q2 2025) 🚧</h3>
                    <p className="text-gray-300 mb-4">
                      Budowanie społeczności i narzędzi współpracy
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">W planach:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>🔄 System komentarzy</li>
                          <li>🔄 Grupy tematyczne</li>
                          <li>🔄 Współdzielenie analiz</li>
                          <li>🔄 API dla deweloperów</li>
                          <li>🔄 Plugin system</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Jak pomóc:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Testowanie beta wersji</li>
                          <li>• Zgłaszanie błędów</li>
                          <li>• Propozycje funkcji</li>
                          <li>• Tłumaczenia</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Phase 3 */}
              <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Faza 3: Zaawansowane AI (Q3-Q4 2025) 🔮</h3>
                    <p className="text-gray-300 mb-4">
                      Integracja z najnowszymi modelami AI i machine learning
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Wizja:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>🔮 Predykcyjne modele</li>
                          <li>🔮 Personalne AI coach</li>
                          <li>🔮 Analiza wzorców życiowych</li>
                          <li>🔮 Integracja z IoT</li>
                          <li>🔮 Voice interface</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-pink-400 mb-2">Technologie:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• GPT-4+ integration</li>
                          <li>• Custom ML models</li>
                          <li>• Real-time analytics</li>
                          <li>• Edge computing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-8">
            <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-purple-500/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Gotowy na rozpoczęcie swojej kosmicznej podróży?
              </h2>
              <p className="text-lg text-gray-200 mb-6">
                Dołącz do tysięcy użytkowników, którzy już odkryli swój unikalny portret duszy
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleCreateProfile}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Stwórz Swój Profil Teraz
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    100% Bezpłatne • Open Source • Bez rejestracji
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>⭐ GitHub</span>
                    <span>🌍 MIT License</span>
                    <span>🔒 Privacy First</span>
                  </div>
                </div>
              </div>
            </Card>
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
