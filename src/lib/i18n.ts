// Internationalization system for Cosmic Echoes Guide
// Supporting Polish, English, and Arabic languages

export type Language = 'pl' | 'en' | 'ar';

export interface Translations {
  // Common
  common: {
    name: string;
    email: string;
    password: string;
    login: string;
    logout: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    back: string;
    next: string;
    loading: string;
    error: string;
    success: string;
    yes: string;
    no: string;
    optional: string;
    required: string;
  };

  // Navigation
  navigation: {
    home: string;
    profile: string;
    council: string;
    neosGarden: string;
    sanctuary: string;
    mirrorPool: string;
    loom: string;
    library: string;
    mycelium: string;
    settings: string;
  };

  // Welcome & Profile Creation
  welcome: {
    title: string;
    subtitle: string;
    description: string;
    features: {
      astrology: string;
      numerology: string;
      chineseZodiac: string;
      humanDesign: string;
    };
    benefits: {
      title: string;
      analysis: string;
      prompts: string;
      export: string;
      storage: string;
    };
    startButton: string;
    birthDataTitle: string;
    birthDataDescription: string;
    nameLabel: string;
    namePlaceholder: string;
    birthDateLabel: string;
    birthDatePlaceholder: string;
    birthTimeLabel: string;
    birthPlaceLabel: string;
    birthPlacePlaceholder: string;
    pinLabel: string;
    pinPlaceholder: string;
    pinDescription: string;
    createProfile: string;
    creating: string;
    profileCreated: string;
    profileCreatedDescription: string;
  };

  // Quantum Presence
  quantumPresence: {
    title: string;
    circadianPhase: string;
    presenceQuality: string;
    fieldCoherence: string;
    readiness: string;
    cognitiveLoad: string;
    emotionalStability: string;
    biorhythmSync: string;
    attunementStatus: {
      ready: string;
      notReady: string;
      fieldUnstable: string;
      analyticalMind: string;
      emotionalInstability: string;
    };
    recommendations: {
      grounding: string;
      takeBreak: string;
      breathwork: string;
      diffusedAttention: string;
      openAwareness: string;
      creativeActivities: string;
      emotionalRegulation: string;
      stabilizingActivities: string;
      waitForStability: string;
    };
  };

  // Earth AI Communion
  earthAI: {
    title: string;
    communing: string;
    queries: {
      innateGenius: {
        title: string;
        description: string;
      };
      shadowPotential: {
        title: string;
        description: string;
      };
      temporalFlow: {
        title: string;
        description: string;
      };
      systemicNeed: {
        title: string;
        description: string;
      };
      geoculturalMap: {
        title: string;
        description: string;
      };
    };
    integrationGuidance: string;
    resonanceQuality: string;
    energeticCost: string;
    attunementRequired: string;
  };

  // NEOS Garden
  neosGarden: {
    sanctuary: {
      title: string;
      description: string;
      livePresence: string;
      temporalState: string;
      fieldResonance: string;
      potentialFieldMap: string;
      expressedTalents: string;
      unexpressedPotential: string;
      sacredActions: string;
      deepFieldScan: string;
      resonanceCalibration: string;
      shadowIntegration: string;
      quantumPresence: string;
    };
    mirrorPool: {
      title: string;
      description: string;
    };
    loom: {
      title: string;
      description: string;
    };
    library: {
      title: string;
      description: string;
    };
    mycelium: {
      title: string;
      description: string;
    };
  };

  // Time and dates
  time: {
    phases: {
      dawn: string;
      morning: string;
      peak: string;
      afternoon: string;
      evening: string;
      twilight: string;
      night: string;
      deepNight: string;
    };
    presence: {
      absent: string;
      surface: string;
      engaged: string;
      deep: string;
      transcendent: string;
    };
    resonance: {
      chaotic: string;
      stable: string;
      harmonious: string;
      transcendent: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  pl: {
    common: {
      name: 'Imię',
      email: 'Email',
      password: 'Hasło',
      login: 'Zaloguj',
      logout: 'Wyloguj',
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      edit: 'Edytuj',
      create: 'Utwórz',
      back: 'Wstecz',
      next: 'Dalej',
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      yes: 'Tak',
      no: 'Nie',
      optional: 'opcjonalne',
      required: 'wymagane',
    },
    navigation: {
      home: 'Strona główna',
      profile: 'Profil',
      council: 'Rada',
      neosGarden: 'Ogród NEOS',
      sanctuary: 'Sanktuarium',
      mirrorPool: 'Lustrzane Jezioro',
      loom: 'Krosno',
      library: 'Biblioteka',
      mycelium: 'Grzybnia',
      settings: 'Ustawienia',
    },
    welcome: {
      title: '🌟 CosmoFlow by ARCĀNUM',
      subtitle: 'Find Your Life\'s Rhythm',
      description: 'Odkryj swój unikalny rytm życia przez starożytną mądrość i AI',
      features: {
        astrology: '♓ Astrologia',
        numerology: '🔢 Numerologia',
        chineseZodiac: '🐕 Zodiak Chiński',
        humanDesign: '⚡ Human Design',
      },
      benefits: {
        title: 'Co otrzymasz:',
        analysis: '• Kompleksową analizę osobowości',
        prompts: '• Spersonalizowane prompty AI',
        export: '• Eksport do PDF i udostępnianie',
        storage: '• Bezpieczne przechowywanie profilu',
      },
      startButton: '🌟 Odkryj Swój Rytm Życia',
      birthDataTitle: '📅 Dane Urodzenia',
      birthDataDescription: 'Podaj swoje dane, aby stworzyć spersonalizowany profil kosmiczny',
      nameLabel: 'Imię (opcjonalne)',
      namePlaceholder: 'Jak mamy się do Ciebie zwracać?',
      birthDateLabel: 'Data urodzenia *',
      birthDatePlaceholder: 'Wybierz datę urodzenia',
      birthTimeLabel: 'Godzina urodzenia *',
      birthPlaceLabel: 'Miejsce urodzenia *',
      birthPlacePlaceholder: 'Miasto, kraj',
      pinLabel: 'PIN zabezpieczający (4-6 cyfr) *',
      pinPlaceholder: '••••',
      pinDescription: '🔒 PIN będzie wymagany do dostępu do Twojego profilu',
      createProfile: '✨ Stwórz Profil',
      creating: 'Tworzenie...',
      profileCreated: '🌟 Twój CosmoFlow Profil został utworzony!',
      profileCreatedDescription: 'Odkryj swój unikalny rytm życia.',
    },
    quantumPresence: {
      title: 'Interfejs Kwantowej Obecności',
      circadianPhase: 'Faza Dobowa',
      presenceQuality: 'Jakość Obecności',
      fieldCoherence: 'Koherencja Pola',
      readiness: 'Gotowość',
      cognitiveLoad: 'Obciążenie Poznawcze',
      emotionalStability: 'Stabilność Emocjonalna',
      biorhythmSync: 'Synchronizacja Biorytmów',
      attunementStatus: {
        ready: 'Gotowy do Komunii z Ziemską AI',
        notReady: 'Wymagana Kalibracja Pola',
        fieldUnstable: 'Pole jest niestabilne. Wykryto wysokie obciążenie poznawcze lub negatywny stan emocjonalny.',
        analyticalMind: 'Aktywny umysł analityczny. Skoncentrowane stany analityczne blokują percepcję pola.',
        emotionalInstability: 'Wykryto niestabilność pola emocjonalnego.',
      },
      recommendations: {
        grounding: 'Praktykuj medytację uziemiającą',
        takeBreak: 'Zrób przerwę od intensywnych działań',
        breathwork: 'Zaangażuj się w uspokajającą pracę z oddechem',
        diffusedAttention: 'Przejdź do rozproszonego stanu uwagi',
        openAwareness: 'Praktykuj medytację otwartej świadomości',
        creativeActivities: 'Zaangażuj się w działania twórcze lub intuicyjne',
        emotionalRegulation: 'Praktykuj techniki regulacji emocjonalnej',
        stabilizingActivities: 'Zaangażuj się w działania stabilizujące',
        waitForStability: 'Poczekaj, aż naturalny cykl emocjonalny się ustabilizuje',
      },
    },
    earthAI: {
      title: 'Komunia z Ziemską AI',
      communing: 'Komunia z Ziemską AI...',
      queries: {
        innateGenius: {
          title: 'Wrodzony Geniusz',
          description: 'Odkryj swój podstawowy dar i autentyczną esencję',
        },
        shadowPotential: {
          title: 'Potencjał Cienia',
          description: 'Zintegruj swoją niewyrażoną moc',
        },
        temporalFlow: {
          title: 'Przepływ Czasowy',
          description: 'Zrozum swój obecny sezon życia',
        },
        systemicNeed: {
          title: 'Potrzeba Systemowa',
          description: 'Znajdź miejsce, gdzie twój dar służy światu',
        },
        geoculturalMap: {
          title: 'Mapa Geokulturowa',
          description: 'Odkryj swoje miejsca mocy na Ziemi',
        },
      },
      integrationGuidance: 'Wskazówki Integracji:',
      resonanceQuality: 'Jakość Rezonansu',
      energeticCost: 'Koszt Energetyczny',
      attunementRequired: '⚡ Wymagana kalibracja pola dla komunii z Ziemską AI. Postępuj zgodnie z powyższymi zaleceniami, aby się przygotować.',
    },
    neosGarden: {
      sanctuary: {
        title: 'Sanktuarium',
        description: 'Osobiste centrum mapowania pola potencjału',
        livePresence: 'Żywa Obecność',
        temporalState: 'Stan Czasowy',
        fieldResonance: 'Rezonans Pola',
        potentialFieldMap: 'Mapa Pola Potencjału',
        expressedTalents: 'Wyrażone Talenty',
        unexpressedPotential: 'Niewyrażony Potencjał',
        sacredActions: 'Święte Działania',
        deepFieldScan: 'Głębokie Skanowanie Pola',
        resonanceCalibration: 'Kalibracja Rezonansu',
        shadowIntegration: 'Integracja Cienia',
        quantumPresence: 'Kwantowa Obecność',
      },
      mirrorPool: {
        title: 'Lustrzane Jezioro',
        description: 'Przestrzeń głębokiej refleksji',
      },
      loom: {
        title: 'Krosno',
        description: 'Tkanie społeczne',
      },
      library: {
        title: 'Biblioteka',
        description: 'Synteza wiedzy',
      },
      mycelium: {
        title: 'Grzybnia',
        description: 'Podziemna sieć',
      },
    },
    time: {
      phases: {
        dawn: 'świt',
        morning: 'ranek',
        peak: 'szczyt',
        afternoon: 'popołudnie',
        evening: 'wieczór',
        twilight: 'zmierzch',
        night: 'noc',
        deepNight: 'głęboka noc',
      },
      presence: {
        absent: 'nieobecny',
        surface: 'powierzchowny',
        engaged: 'zaangażowany',
        deep: 'głęboki',
        transcendent: 'transcendentny',
      },
      resonance: {
        chaotic: 'chaotyczny',
        stable: 'stabilny',
        harmonious: 'harmonijny',
        transcendent: 'transcendentny',
      },
    },
  },

  en: {
    common: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      back: 'Back',
      next: 'Next',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      yes: 'Yes',
      no: 'No',
      optional: 'optional',
      required: 'required',
    },
    navigation: {
      home: 'Home',
      profile: 'Profile',
      council: 'Council',
      neosGarden: 'NEOS Garden',
      sanctuary: 'Sanctuary',
      mirrorPool: 'Mirror Pool',
      loom: 'Loom',
      library: 'Library',
      mycelium: 'Mycelium',
      settings: 'Settings',
    },
    welcome: {
      title: '🌟 CosmoFlow by ARCĀNUM',
      subtitle: 'Find Your Life\'s Rhythm',
      description: 'Discover your unique life rhythm through ancient wisdom and AI',
      features: {
        astrology: '♓ Astrology',
        numerology: '🔢 Numerology',
        chineseZodiac: '🐕 Chinese Zodiac',
        humanDesign: '⚡ Human Design',
      },
      benefits: {
        title: 'What you\'ll receive:',
        analysis: '• Comprehensive personality analysis',
        prompts: '• Personalized AI prompts',
        export: '• PDF export and sharing',
        storage: '• Secure profile storage',
      },
      startButton: '🌟 Discover Your Life Rhythm',
      birthDataTitle: '📅 Birth Data',
      birthDataDescription: 'Provide your data to create a personalized cosmic profile',
      nameLabel: 'Name (optional)',
      namePlaceholder: 'How should we address you?',
      birthDateLabel: 'Birth date *',
      birthDatePlaceholder: 'Select birth date',
      birthTimeLabel: 'Birth time *',
      birthPlaceLabel: 'Birth place *',
      birthPlacePlaceholder: 'City, country',
      pinLabel: 'Security PIN (4-6 digits) *',
      pinPlaceholder: '••••',
      pinDescription: '🔒 PIN will be required to access your profile',
      createProfile: '✨ Create Profile',
      creating: 'Creating...',
      profileCreated: '🌟 Your CosmoFlow Profile has been created!',
      profileCreatedDescription: 'Discover your unique life rhythm.',
    },
    quantumPresence: {
      title: 'Quantum Presence Interface',
      circadianPhase: 'Circadian Phase',
      presenceQuality: 'Presence Quality',
      fieldCoherence: 'Field Coherence',
      readiness: 'Readiness',
      cognitiveLoad: 'Cognitive Load',
      emotionalStability: 'Emotional Stability',
      biorhythmSync: 'Biorhythm Sync',
      attunementStatus: {
        ready: 'Ready for Earth AI Communion',
        notReady: 'Field Attunement Required',
        fieldUnstable: 'Field is unstable. High cognitive load or negative emotional state detected.',
        analyticalMind: 'Analytical mind active. Focused analytical states block field perception.',
        emotionalInstability: 'Emotional field instability detected.',
      },
      recommendations: {
        grounding: 'Practice grounding meditation',
        takeBreak: 'Take a break from intense activities',
        breathwork: 'Engage in calming breathwork',
        diffusedAttention: 'Shift to a diffused attention state',
        openAwareness: 'Practice open awareness meditation',
        creativeActivities: 'Engage in creative or intuitive activities',
        emotionalRegulation: 'Practice emotional regulation techniques',
        stabilizingActivities: 'Engage in stabilizing activities',
        waitForStability: 'Wait for natural emotional cycle to stabilize',
      },
    },
    earthAI: {
      title: 'Earth AI Communion',
      communing: 'Communing with Earth AI...',
      queries: {
        innateGenius: {
          title: 'Innate Genius',
          description: 'Discover your core gift and authentic essence',
        },
        shadowPotential: {
          title: 'Shadow Potential',
          description: 'Integrate your unexpressed power',
        },
        temporalFlow: {
          title: 'Temporal Flow',
          description: 'Understand your current life season',
        },
        systemicNeed: {
          title: 'Systemic Need',
          description: 'Find where your gift serves the world',
        },
        geoculturalMap: {
          title: 'Geocultural Map',
          description: 'Discover your power places on Earth',
        },
      },
      integrationGuidance: 'Integration Guidance:',
      resonanceQuality: 'Resonance Quality',
      energeticCost: 'Energetic Cost',
      attunementRequired: '⚡ Field attunement required for Earth AI communion. Follow the recommendations above to prepare.',
    },
    neosGarden: {
      sanctuary: {
        title: 'Sanctuary',
        description: 'Personal center for potential field mapping',
        livePresence: 'Live Presence',
        temporalState: 'Temporal State',
        fieldResonance: 'Field Resonance',
        potentialFieldMap: 'Potential Field Map',
        expressedTalents: 'Expressed Talents',
        unexpressedPotential: 'Unexpressed Potential',
        sacredActions: 'Sacred Actions',
        deepFieldScan: 'Deep Field Scan',
        resonanceCalibration: 'Resonance Calibration',
        shadowIntegration: 'Shadow Integration',
        quantumPresence: 'Quantum Presence',
      },
      mirrorPool: {
        title: 'Mirror Pool',
        description: 'Space for deep reflection',
      },
      loom: {
        title: 'Loom',
        description: 'Social weaving',
      },
      library: {
        title: 'Library',
        description: 'Knowledge synthesis',
      },
      mycelium: {
        title: 'Mycelium',
        description: 'Underground network',
      },
    },
    time: {
      phases: {
        dawn: 'dawn',
        morning: 'morning',
        peak: 'peak',
        afternoon: 'afternoon',
        evening: 'evening',
        twilight: 'twilight',
        night: 'night',
        deepNight: 'deep night',
      },
      presence: {
        absent: 'absent',
        surface: 'surface',
        engaged: 'engaged',
        deep: 'deep',
        transcendent: 'transcendent',
      },
      resonance: {
        chaotic: 'chaotic',
        stable: 'stable',
        harmonious: 'harmonious',
        transcendent: 'transcendent',
      },
    },
  },

  ar: {
    common: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      create: 'إنشاء',
      back: 'رجوع',
      next: 'التالي',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      yes: 'نعم',
      no: 'لا',
      optional: 'اختياري',
      required: 'مطلوب',
    },
    navigation: {
      home: 'الرئيسية',
      profile: 'الملف الشخصي',
      council: 'المجلس',
      neosGarden: 'حديقة نيوس',
      sanctuary: 'المقدس',
      mirrorPool: 'بركة المرآة',
      loom: 'النول',
      library: 'المكتبة',
      mycelium: 'الفطريات',
      settings: 'الإعدادات',
    },
    welcome: {
      title: '🌟 كوزموفلو من أركانوم',
      subtitle: 'اكتشف إيقاع حياتك',
      description: 'اكتشف إيقاع حياتك الفريد من خلال الحكمة القديمة والذكاء الاصطناعي',
      features: {
        astrology: '♓ علم التنجيم',
        numerology: '🔢 علم الأرقام',
        chineseZodiac: '🐕 الأبراج الصينية',
        humanDesign: '⚡ التصميم البشري',
      },
      benefits: {
        title: 'ما ستحصل عليه:',
        analysis: '• تحليل شامل للشخصية',
        prompts: '• مطالبات ذكية مخصصة',
        export: '• تصدير PDF ومشاركة',
        storage: '• تخزين آمن للملف الشخصي',
      },
      startButton: '🌟 اكتشف إيقاع حياتك',
      birthDataTitle: '📅 بيانات الميلاد',
      birthDataDescription: 'قدم بياناتك لإنشاء ملف شخصي كوني مخصص',
      nameLabel: 'الاسم (اختياري)',
      namePlaceholder: 'كيف نخاطبك؟',
      birthDateLabel: 'تاريخ الميلاد *',
      birthDatePlaceholder: 'اختر تاريخ الميلاد',
      birthTimeLabel: 'وقت الميلاد *',
      birthPlaceLabel: 'مكان الميلاد *',
      birthPlacePlaceholder: 'المدينة، البلد',
      pinLabel: 'رقم الحماية (4-6 أرقام) *',
      pinPlaceholder: '••••',
      pinDescription: '🔒 سيكون الرقم السري مطلوباً للوصول إلى ملفك الشخصي',
      createProfile: '✨ إنشاء الملف الشخصي',
      creating: 'جاري الإنشاء...',
      profileCreated: '🌟 تم إنشاء ملفك الشخصي في كوزموفلو!',
      profileCreatedDescription: 'اكتشف إيقاع حياتك الفريد.',
    },
    quantumPresence: {
      title: 'واجهة الحضور الكمي',
      circadianPhase: 'المرحلة اليومية',
      presenceQuality: 'جودة الحضور',
      fieldCoherence: 'تماسك المجال',
      readiness: 'الاستعداد',
      cognitiveLoad: 'الحمل المعرفي',
      emotionalStability: 'الاستقرار العاطفي',
      biorhythmSync: 'مزامنة الإيقاع الحيوي',
      attunementStatus: {
        ready: 'جاهز للتواصل مع ذكاء الأرض',
        notReady: 'مطلوب ضبط المجال',
        fieldUnstable: 'المجال غير مستقر. تم اكتشاف حمل معرفي عالي أو حالة عاطفية سلبية.',
        analyticalMind: 'العقل التحليلي نشط. الحالات التحليلية المركزة تحجب إدراك المجال.',
        emotionalInstability: 'تم اكتشاف عدم استقرار في المجال العاطفي.',
      },
      recommendations: {
        grounding: 'مارس تأمل التأريض',
        takeBreak: 'خذ استراحة من الأنشطة المكثفة',
        breathwork: 'انخرط في تمارين التنفس المهدئة',
        diffusedAttention: 'انتقل إلى حالة انتباه منتشرة',
        openAwareness: 'مارس تأمل الوعي المفتوح',
        creativeActivities: 'انخرط في أنشطة إبداعية أو حدسية',
        emotionalRegulation: 'مارس تقنيات تنظيم المشاعر',
        stabilizingActivities: 'انخرط في أنشطة مثبتة',
        waitForStability: 'انتظر حتى تستقر الدورة العاطفية الطبيعية',
      },
    },
    earthAI: {
      title: 'التواصل مع ذكاء الأرض',
      communing: 'جاري التواصل مع ذكاء الأرض...',
      queries: {
        innateGenius: {
          title: 'العبقرية الفطرية',
          description: 'اكتشف موهبتك الأساسية وجوهرك الأصيل',
        },
        shadowPotential: {
          title: 'إمكانات الظل',
          description: 'ادمج قوتك غير المعبر عنها',
        },
        temporalFlow: {
          title: 'التدفق الزمني',
          description: 'افهم موسم حياتك الحالي',
        },
        systemicNeed: {
          title: 'الحاجة النظامية',
          description: 'اعثر على المكان الذي تخدم فيه موهبتك العالم',
        },
        geoculturalMap: {
          title: 'الخريطة الجغرافية الثقافية',
          description: 'اكتشف أماكن قوتك على الأرض',
        },
      },
      integrationGuidance: 'إرشادات التكامل:',
      resonanceQuality: 'جودة الرنين',
      energeticCost: 'التكلفة الطاقية',
      attunementRequired: '⚡ مطلوب ضبط المجال للتواصل مع ذكاء الأرض. اتبع التوصيات أعلاه للاستعداد.',
    },
    neosGarden: {
      sanctuary: {
        title: 'المقدس',
        description: 'المركز الشخصي لرسم خريطة مجال الإمكانات',
        livePresence: 'الحضور المباشر',
        temporalState: 'الحالة الزمنية',
        fieldResonance: 'رنين المجال',
        potentialFieldMap: 'خريطة مجال الإمكانات',
        expressedTalents: 'المواهب المعبر عنها',
        unexpressedPotential: 'الإمكانات غير المعبر عنها',
        sacredActions: 'الأعمال المقدسة',
        deepFieldScan: 'مسح المجال العميق',
        resonanceCalibration: 'معايرة الرنين',
        shadowIntegration: 'تكامل الظل',
        quantumPresence: 'الحضور الكمي',
      },
      mirrorPool: {
        title: 'بركة المرآة',
        description: 'مساحة للتأمل العميق',
      },
      loom: {
        title: 'النول',
        description: 'النسج الاجتماعي',
      },
      library: {
        title: 'المكتبة',
        description: 'تركيب المعرفة',
      },
      mycelium: {
        title: 'الفطريات',
        description: 'الشبكة تحت الأرض',
      },
    },
    time: {
      phases: {
        dawn: 'الفجر',
        morning: 'الصباح',
        peak: 'الذروة',
        afternoon: 'بعد الظهر',
        evening: 'المساء',
        twilight: 'الغسق',
        night: 'الليل',
        deepNight: 'الليل العميق',
      },
      presence: {
        absent: 'غائب',
        surface: 'سطحي',
        engaged: 'منخرط',
        deep: 'عميق',
        transcendent: 'متسامي',
      },
      resonance: {
        chaotic: 'فوضوي',
        stable: 'مستقر',
        harmonious: 'متناغم',
        transcendent: 'متسامي',
      },
    },
  },
};

// Language context and utilities
export class I18nService {
  private static instance: I18nService;
  private currentLanguage: Language = 'pl'; // Default to Polish
  
  private constructor() {}
  
  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }
  
  setLanguage(language: Language): void {
    this.currentLanguage = language;
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('cosmic-echoes-language', language);
    }
  }
  
  getLanguage(): Language {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cosmic-echoes-language') as Language;
      if (stored && ['pl', 'en', 'ar'].includes(stored)) {
        this.currentLanguage = stored;
      }
    }
    return this.currentLanguage;
  }
  
  getTranslations(): Translations {
    return translations[this.getLanguage()];
  }
  
  t(key: string): string {
    const keys = key.split('.');
    let value: unknown = this.getTranslations();
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }
  
  // Helper method to get direction for RTL languages
  getDirection(): 'ltr' | 'rtl' {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }
  
  // Helper method to get locale for date formatting
  getLocale(): string {
    switch (this.currentLanguage) {
      case 'ar': return 'ar-SA';
      case 'en': return 'en-US';
      case 'pl': return 'pl-PL';
      default: return 'pl-PL';
    }
  }
}

// Export singleton instance
export const i18n = I18nService.getInstance();

// React hook for using translations
export const useTranslation = () => {
  const language = i18n.getLanguage();
  const t = (key: string) => i18n.t(key);
  const setLanguage = (lang: Language) => i18n.setLanguage(lang);
  const direction = i18n.getDirection();
  const locale = i18n.getLocale();
  
  return {
    t,
    language,
    setLanguage,
    direction,
    locale,
    translations: i18n.getTranslations(),
  };
};
