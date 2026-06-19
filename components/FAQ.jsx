'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: "Is PromtNest free to use?", a: "Yes, our core library is completely free. We also offer a Pro tier for creators who want exclusive, battle-tested advanced prompts." },
    { q: "Can I sell my own prompts?", a: "Absolutely. Verified Creators can monetize their high-quality prompts and earn a majority share of the revenue." },
    { q: "Does this connect to OpenAI/Midjourney automatically?", a: "Currently, we act as a secure repository. In the near future, our API will allow direct execution right from the dashboard." },
    { q: "How is the community moderated?", a: "We have strict quality guidelines and a review system. Low-effort prompts are automatically filtered out to ensure top tier quality." }
  ];

  return (
    <section className="py-24 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="border border-foreground/10 rounded-2xl bg-surface overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-foreground/5 transition-colors focus:outline-none"
            >
              <span className="font-bold text-lg text-foreground">{faq.q}</span>
              <motion.div
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-primary flex-shrink-0 ml-4"
              >
                <ChevronDown size={24} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-foreground/70 leading-relaxed border-t border-foreground/5 pt-4 mt-2">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
