import { useState, useEffect } from 'react';

interface ScrollProgress {
  progress: number;
  activeSection: string;
}

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    activeSection: ''
  });

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);

      // Find active section
      const sections = document.querySelectorAll('[data-section]');
      let activeSection = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          activeSection = section.getAttribute('data-section') || '';
        }
      });

      setScrollProgress({ progress, activeSection });
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return { ...scrollProgress, scrollToSection };
};
