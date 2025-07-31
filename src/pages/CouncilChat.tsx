import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

// Placeholder data for council members
const councilMembers = [
  { name: 'Architekt', avatar: '🧭' },
  { name: 'Wyrocznia', avatar: '🔮' },
  { name: 'Alchemiczka', avatar: '⚗️' },
  { name: 'Pionier', avatar: '🚀' },
  { name: 'Kronikarz', avatar: '📜' },
  { name: 'Echo', avatar: '🌀' },
];

const CouncilChat = () => {
  return (
    <div className="min-h-screen bg-gradient-cosmic flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-purple/30">
        <CardHeader className="border-b border-cosmic-purple/20">
          <CardTitle className="text-cosmic-gold text-center">Rada Kosmiczna</CardTitle>
          <div className="flex justify-center gap-4 pt-2">
            {councilMembers.map(member => (
              <div key={member.name} className="flex flex-col items-center group cursor-pointer">
                <span className="text-2xl group-hover:animate-pulse">{member.avatar}</span>
                <span className="text-xs text-cosmic-starlight group-hover:text-cosmic-gold">{member.name}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Chat messages will go here */}
          <div className="text-center text-cosmic-starlight/70">
            Sesja z Radą rozpoczęta. Zadaj pytanie lub opisz, co Cię nurtuje.
          </div>
        </CardContent>
        <div className="p-4 border-t border-cosmic-purple/20">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Porozmawiaj z Radą..."
              className="flex-1 bg-cosmic-dark/50 border-cosmic-purple/30 text-cosmic-starlight"
            />
            <Button className="bg-cosmic-purple hover:bg-cosmic-purple/80">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CouncilChat;
