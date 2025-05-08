import { ReactNode } from 'react';
import BoostedProjectsBanner from './BoostedProjectsBanner';
import AnimatedBackground from './AnimatedBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground>
        <div className="relative z-10 flex flex-col min-h-screen">
          <BoostedProjectsBanner />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </AnimatedBackground>
    </div>
  );
} 