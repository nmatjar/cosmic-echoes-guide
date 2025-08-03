import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        onAuthSuccess();
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border-purple-500/30 text-white shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-purple-500/30">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Witaj Ponownie</CardTitle>
          <CardDescription className="text-gray-300 pt-2">
            Zaloguj się, aby uzyskać dostęp do panelu administratora lub zarządzać swoim kontem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#a855f7',
                    brandAccent: '#9333ea',
                    defaultButtonBackgroundHover: '#c084fc',
                    inputText: '#e5e7eb',
                    inputBackground: 'rgba(255, 255, 255, 0.05)',
                    inputBorder: 'rgba(168, 85, 247, 0.3)',
                    inputLabelText: '#d1d5db',
                    messageText: '#d1d5db',
                    anchorTextColor: '#d8b4fe',
                    anchorTextHoverColor: '#ffffff',
                  },
                  fonts: {
                    bodyFontFamily: 'inherit',
                    buttonFontFamily: 'inherit',
                    labelFontFamily: 'inherit',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    inputBorderRadius: '8px',
                  }
                },
              },
            }}
            providers={['google', 'github']}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Adres e-mail',
                  password_label: 'Hasło',
                  email_input_placeholder: 'Twój adres e-mail',
                  password_input_placeholder: 'Twoje hasło',
                  button_label: 'Zaloguj się',
                  social_provider_text: 'Zaloguj się przez {{provider}}',
                  link_text: 'Masz już konto? Zaloguj się',
                },
                sign_up: {
                    email_label: 'Adres e-mail',
                    password_label: 'Hasło',
                    email_input_placeholder: 'Twój adres e-mail',
                    password_input_placeholder: 'Twoje hasło',
                    button_label: 'Zarejestruj się',
                    social_provider_text: 'Zarejestruj się przez {{provider}}',
                    link_text: 'Nie masz konta? Zarejestruj się',
                },
                forgotten_password: {
                    email_label: 'Adres e-mail',
                    email_input_placeholder: 'Twój adres e-mail',
                    button_label: 'Wyślij instrukcje resetowania hasła',
                    link_text: 'Zapomniałeś hasła?',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;