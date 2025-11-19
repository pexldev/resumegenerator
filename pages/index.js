import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';

const ResumeGenerator = dynamic(() => import('@/components/Resumegenerator'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <ResumeGenerator />
      <Analytics />
    </div>
  );
}