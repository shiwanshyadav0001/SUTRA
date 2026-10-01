'use client';

import React from 'react';
import { IntelligenceProvider } from '@/context/IntelligenceContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { GuidedDemoTour } from '@/components/ui/GuidedDemoTour';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <IntelligenceProvider>
      <CustomCursor />
      {children}
      <GuidedDemoTour />
    </IntelligenceProvider>
  );
}
