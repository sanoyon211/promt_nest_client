'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        setReviews([
          { id: 1, text: "PromtNest transformed my workflow. Finding high-quality prompts is effortless now.", author: "Sarah W.", role: "Marketer" },
          { id: 2, text: "The quality of AI art prompts here is unmatched. It's a goldmine for creators.", author: "David L.", role: "Digital Artist" },
        ]);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map(review => (
          <div key={review.id} className="bg-surface p-8 rounded-2xl border border-foreground/10 relative shadow-sm">
            <svg className="absolute top-6 right-6 w-8 h-8 text-foreground/5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-lg text-foreground/80 mb-6 italic relative z-10 leading-relaxed">"{review.text}"</p>
            <div>
              <p className="font-bold text-foreground">{review.author}</p>
              <p className="text-sm font-medium text-primary mt-1">{review.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
