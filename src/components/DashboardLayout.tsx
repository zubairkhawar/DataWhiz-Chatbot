import React from 'react';
import SidebarWithToggle from './Sidebar';

export default function DashboardLayout({ children, sidebar, topbar }: { children: React.ReactNode; sidebar: React.ReactNode; topbar: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      {sidebar}
      <div className="md:ml-64">
        {topbar}
        <main className="pt-20 px-4 sm:px-8 pb-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
} 
 