'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#F8FAFC]">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
