import PromptDetailsClient from '@/components/prompt-details/PromptDetailsClient';
import PrivateRoute from '@/components/PrivateRoute';

// Dynamic Metadata Generation for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`);
    const prompt = await res.json();
    
    return {
      title: prompt.title || "Prompt Details",
      description: prompt.description || "View details for this optimized AI prompt.",
    };
  } catch (error) {
    return { title: "Prompt Details" };
  }
}

export default async function PromptDetailsPage({ params }) {
  // Safe extraction for Next.js 15 App Router where params is an asynchronous promise
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <PrivateRoute>
      <PromptDetailsClient promptId={id} />
    </PrivateRoute>
  );
}