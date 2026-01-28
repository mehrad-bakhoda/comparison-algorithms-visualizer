'use client';

import { Button } from '@/components/ui/button';
import { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('en')}
      >
        English
      </Button>
      <Button
        variant={language === 'fa' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('fa')}
      >
        فارسی
      </Button>
    </div>
  );
}
