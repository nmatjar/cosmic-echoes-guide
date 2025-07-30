import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Share2, Mail, MessageCircle, QrCode, FileText, FileJson, Code2 } from "lucide-react";
import { getProfiles } from "@/services/profileManager";
import { exportProfileCoder34ToFile } from "@/services/profileCoderExport";
import { PDFExportService } from "@/services/pdfExportService";
import { QRCodeService } from "@/services/qrCodeService";
import { UserProfile } from "@/engine/userProfile";

interface ExportHubProps {
  currentProfile?: UserProfile | null;
}

export function ExportHub({ currentProfile }: ExportHubProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportType, setExportType] = useState<string>("");
  const [qrCodeData, setQrCodeData] = useState<string>("");

  const generatePDF = async () => {
    if (!currentProfile) {
      toast.error("Brak profilu do eksportu", {
        description: "Najpierw stwórz profil, aby móc go wyeksportować.",
      });
      return;
    }

    setIsExporting(true);
    setExportType("PDF");
    setExportProgress(0);

    try {
      // Progress simulation with real steps
      const steps = [
        { progress: 20, message: "Przygotowywanie cosmic layout..." },
        { progress: 40, message: "Renderowanie sekcji astrologicznych..." },
        { progress: 60, message: "Dodawanie numerologii i Human Design..." },
        { progress: 80, message: "Finalizowanie cosmic design..." },
        { progress: 100, message: "PDF gotowy do pobrania!" }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setExportProgress(step.progress);
        toast.info(step.message, { duration: 800 });
      }

      // Generate actual PDF
      await PDFExportService.generateProfilePDF(currentProfile);

      toast.success("🌟 Kosmiczny Portret Duszy został zapisany jako PDF!", {
        description: "Plik zawiera wszystkie sekcje z cosmic design",
        duration: 4000
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Błąd generowania PDF", {
        description: error instanceof Error ? error.message : "Nieznany błąd",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportProfileToJson = () => {
    const profiles = getProfiles();
    if (profiles.length === 0) {
      toast.error("Nie znaleziono profilu do wyeksportowania.", {
        description: "Najpierw stwórz profil, aby móc go zapisać.",
      });
      return;
    }

    // Na razie eksportujemy pierwszy profil z listy
    const profileToExport = profiles[0];
    const jsonString = JSON.stringify(profileToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cosmic-echoes-profile-${profileToExport.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Profil JSON został pomyślnie wyeksportowany!", {
      description: "Plik został zapisany na Twoim urządzeniu.",
    });
  };

  const exportProfileCoder34 = () => {
    try {
      exportProfileCoder34ToFile();
      toast.success("🚀 Profil ProfileCoder 3.4 wyeksportowany!", {
        description: "Format zgodny ze standardem interoperacyjności",
        duration: 4000
      });
    } catch (error) {
      toast.error("Błąd eksportu ProfileCoder 3.4", {
        description: error instanceof Error ? error.message : "Nieznany błąd",
      });
    }
  };

  const shareWhatsApp = () => {
    const text = `🌟 Sprawdź mój Kosmiczny Portret Duszy! 

♓ Ryby - Empatyczna i intuicyjna
🔢 33 - Mistrz służby i nauczyciel  
🐕 Pies - Lojalna i sprawiedliwa
⚡ GM 6/2 - Wzorzec dla innych
🏛️ Żółta Gwiazda - Harmonia ciało-duch

Odkryj swój własny portret: ${window.location.href}

#KosmicznyPortret #Astrologia #Numerologia #HumanDesign`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success("🚀 Twój portret leci w kosmos przez WhatsApp!", {
      description: "Dzielisz się cosmic wisdom",
      duration: 3000
    });
  };

  const shareEmail = () => {
    const subject = "🌟 Mój Kosmiczny Portret Duszy - Fascynujące odkrycia!";
    const body = `Cześć!

Właśnie odkryłem/am swój Kosmiczny Portret Duszy i to jest niesamowite! 

Mój profil:
♓ Słońce i Ascendent w Rybach - Empatyczna, intuicyjna natura
🔢 Numerologia 33 - Mistrz służby, nauczyciel, uzdrowiciel
🐕 Pies w Zodiak Chińskim - Lojalna, sprawiedliwa, odporna
⚡ Generator Manifestujący 6/2 - Wzorzec dla innych, autorytet witalny
🏛️ 4 Żółta Gwiazda - Harmonia między ciałem a duchem

To połączenie różnych systemów samopoznania daje niesamowity wgląd w moją osobowość i potencjał!

Sprawdź swój własny portret tutaj: ${window.location.href}

Będzie mi miło usłyszeć o Twoich odkryciach! ✨

Pozdrawiam kosmicznie,
[Twoje imię]`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    toast.success("📧 Email z cosmic wisdom przygotowany!", {
      description: "Twój klient email został otwarty",
      duration: 3000
    });
  };

  const generateQR = async () => {
    setIsExporting(true);
    setExportType("QR");
    setExportProgress(0);

    try {
      // Progress simulation
      for (let i = 0; i <= 80; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
      }

      // Generate actual QR code
      const profileId = currentProfile?.id;
      const qrDataUrl = await QRCodeService.generateProfileQR(profileId);
      setQrCodeData(qrDataUrl);
      setExportProgress(100);

      // Download QR code
      const filename = `CosmoFlow-QR-${currentProfile?.name || 'Profile'}-${new Date().toISOString().split('T')[0]}`;
      await QRCodeService.downloadQRCode(window.location.href, filename, {
        size: 400,
        color: {
          dark: '#FFD700', // Cosmic gold
          light: '#1a1a2e'  // Dark background
        }
      });

      toast.success("📱 QR Code wygenerowany i pobrany!", {
        description: "Kod prowadzi do Twojego cosmic profilu",
        duration: 3000
      });

    } catch (error) {
      console.error('QR generation error:', error);
      toast.error("Błąd generowania QR Code", {
        description: error instanceof Error ? error.message : "Nieznany błąd",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("🔗 Link skopiowany do gwiezdnego schowka!", {
      description: "Gotowy do udostępnienia",
      duration: 3000
    });
  };

  return (
    <Card className="cosmic-card bg-gradient-aurora border-cosmic-gold/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cosmic-gold">
          <Share2 className="h-5 w-5" />
          Eksport i Udostępnianie
        </CardTitle>
        <CardDescription className="text-cosmic-starlight">
          Zachowaj swój Kosmiczny Portret i podziel się cosmic wisdom
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cosmic-gold">Generowanie {exportType}...</span>
              <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold">
                {exportProgress}%
              </Badge>
            </div>
            <Progress value={exportProgress} className="h-2 bg-cosmic-gold/20" />
          </div>
        )}

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* PDF Export */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center gap-2 h-auto py-4 bg-cosmic-purple/10 border-cosmic-purple/30 hover:bg-cosmic-purple/20"
                disabled={isExporting}
              >
                <FileText className="h-6 w-6 text-cosmic-purple" />
                <span className="text-sm">PDF</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>📄 Eksport do PDF</DialogTitle>
                <DialogDescription>
                  Zapisz swój Kosmiczny Portret jako elegancki PDF z cosmic design
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg p-4">
                  <h4 className="font-medium text-cosmic-purple mb-2">PDF będzie zawierać:</h4>
                  <ul className="text-sm text-cosmic-starlight space-y-1">
                    <li>• Wszystkie 7 systemów samopoznania</li>
                    <li>• Cosmic design i kolorystykę</li>
                    <li>• QR code do aplikacji</li>
                    <li>• Twoje spersonalizowane dane</li>
                  </ul>
                </div>
                <Button onClick={generatePDF} className="w-full" disabled={isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  Generuj PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* QR Code */}
          <Button 
            variant="outline" 
            onClick={generateQR}
            className="flex flex-col items-center justify-center gap-2 h-auto py-4 bg-cosmic-teal/10 border-cosmic-teal/30 hover:bg-cosmic-teal/20"
            disabled={isExporting}
          >
            <QrCode className="h-6 w-6 text-cosmic-teal" />
            <span className="text-sm">QR Code</span>
          </Button>
        </div>

        {/* Advanced Export Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-cosmic-gold">Formaty eksportu danych:</h4>
          <div className="grid grid-cols-2 gap-3">
            {/* JSON Export */}
            <Button 
              variant="outline" 
              onClick={exportProfileToJson}
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 bg-cosmic-blue/10 border-cosmic-blue/30 hover:bg-cosmic-blue/20"
              disabled={isExporting}
            >
              <FileJson className="h-6 w-6 text-cosmic-blue" />
              <span className="text-sm">JSON</span>
            </Button>

            {/* ProfileCoder 3.4 Export */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center gap-2 h-auto py-4 bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/10 border-cosmic-gold/30 hover:from-cosmic-gold/20 hover:to-cosmic-purple/20"
                  disabled={isExporting}
                >
                  <Code2 className="h-6 w-6 text-cosmic-gold" />
                  <span className="text-sm">ProfileCoder 3.4</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>🚀 Eksport ProfileCoder 3.4</DialogTitle>
                  <DialogDescription>
                    Wyeksportuj profil w standardowym formacie interoperacyjności
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/10 border border-cosmic-gold/30 rounded-lg p-4">
                    <h4 className="font-medium text-cosmic-gold mb-2">ProfileCoder 3.4 zawiera:</h4>
                    <ul className="text-sm text-cosmic-starlight space-y-1">
                      <li>• 🔢 Numerologia (LP, EX, SU)</li>
                      <li>• 🌌 Astrologia (SS, AS, MC, PL, HO, ASP)</li>
                      <li>• 🐉 Zodiak Chiński (AN, EL, POL)</li>
                      <li>• 🧬 Human Design (TY, PR, AU, CEN, CHA, GAT)</li>
                      <li>• 🏛️ Kalendarz Majów (SI, TO, WAV, DEST)</li>
                      <li>• 🧬⏰ Bio-Rytmy (PH, EM, IN, CYC)</li>
                      <li>• ☯️🌳 Równowaga Żywiołów (FIR, EAR, AIR, WAT, ETH)</li>
                      <li>• 📊 Metadane i interpretacje</li>
                    </ul>
                    <div className="mt-3 p-2 bg-cosmic-gold/20 rounded text-xs text-cosmic-gold">
                      ✨ Format zgodny z innymi systemami ProfileCoder 3.4
                    </div>
                  </div>
                  <Button onClick={exportProfileCoder34} className="w-full" disabled={isExporting}>
                    <Download className="h-4 w-4 mr-2" />
                    Eksportuj ProfileCoder 3.4
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-cosmic-gold">Udostępnij cosmic wisdom:</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              onClick={shareWhatsApp}
              className="flex flex-col items-center gap-1 h-auto py-3 bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs">WhatsApp</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={shareEmail}
              className="flex flex-col items-center gap-1 h-auto py-3 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
            >
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-xs">Email</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={copyLink}
              className="flex flex-col items-center gap-1 h-auto py-3 bg-cosmic-gold/10 border-cosmic-gold/30 hover:bg-cosmic-gold/20"
            >
              <Share2 className="h-4 w-4 text-cosmic-gold" />
              <span className="text-xs">Kopiuj Link</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-cosmic-blue">Cosmic Impact:</span>
            <div className="flex gap-3">
              <Badge variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink text-xs">
                +300% Shares
              </Badge>
              <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple text-xs">
                Viral Ready
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
