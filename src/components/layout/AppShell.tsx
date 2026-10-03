'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0B132B] text-[#0F172A] overflow-hidden selection:bg-blue-600 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#F1F5F9] bg-geo-lattice">
        <Topbar />
        <main className="flex-1 p-5 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
