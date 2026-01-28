'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Language, getTranslation } from '@/lib/i18n';
import LanguageSwitcher from '@/components/language-switcher';
import ComparisonDashboard from '@/components/comparison-dashboard';

export default function ComparePage() {
  const [language, setLanguage] = useState<Language>('en');
  const t = getTranslation(language);
  const isRTL = language === 'fa';

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{t.compare.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t.header.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm">{t.nav.algorithms}</Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="sm">{t.documentation.title}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ComparisonDashboard language={language} />
      </main>
    </div>
  );
}
