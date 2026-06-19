import PromptDetailsClient from '@/components/prompt-details/PromptDetailsClient';
import PrivateRoute from '@/components/PrivateRoute';

export default async function PromptDetailsPage({ params }) {
  // Safe extraction for Next.js App Router where params is an asynchronous promise
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <PrivateRoute>
      <PromptDetailsClient promptId={id} />
    </PrivateRoute>
  );
}
