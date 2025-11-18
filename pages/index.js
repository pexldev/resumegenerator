import dynamic from 'next/dynamic';

const ResumeGenerator = dynamic(() => import('@/components/Resumegenerator'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <ResumeGenerator />
    </div>
  );
}