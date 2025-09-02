import { ReactNode } from 'react';
import Header from './Header';
import RightSidebar from './RightSidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-vazir" dir="rtl">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex">
        {/* Right Sidebar - Navigation */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
