import PromptDetailsClient from '@/components/prompt-details/PromptDetailsClient';

export default async function PromptDetailsPage({ params }) {
  // Safe extraction for Next.js App Router where params is an asynchronous promise
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <PromptDetailsClient promptId={id} />
  );
}
