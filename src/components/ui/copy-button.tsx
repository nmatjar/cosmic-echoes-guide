import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Skopiowano!",
        description: label ? `${label} zostało skopiowane do schowka` : "Tekst został skopiowany do schowka",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się skopiować tekstu",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-8 bg-cosmic-purple/20 border-cosmic-purple/30 hover:bg-cosmic-purple/30 text-cosmic-starlight"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {label && <span className="ml-1 text-xs">{label}</span>}
    </Button>
  );
}