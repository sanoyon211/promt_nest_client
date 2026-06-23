import { Suspense } from 'react';
import CreatorProfileClient from '@/components/creator/CreatorProfileClient';

export const metadata = {
  title: 'Creator Profile | PromtNest',
  description: 'Explore prompts created by this creator.',
};

export default async function CreatorProfilePage({ params }) {
  // Await the params promise in Next.js 15
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CreatorProfileClient creatorId={resolvedParams.id} />
    </Suspense>
  );
}
