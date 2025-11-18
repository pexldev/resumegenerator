import dynamic from 'next/dynamic';

const ResumeGenerator = dynamic(() => import('@/components/ResumeGenerator'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <ResumeGenerator />
    </div>
  );
}