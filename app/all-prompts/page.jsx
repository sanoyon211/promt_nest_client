import { Suspense } from 'react';
import AllPromptsClient from '@/components/AllPromptsClient';

export const metadata = {
  title: 'All Prompts | PromtNest',
  description: 'Explore our extensive library of high-quality AI prompts.',
};

export default function AllPromptsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <AllPromptsClient />
    </Suspense>
  );
}
