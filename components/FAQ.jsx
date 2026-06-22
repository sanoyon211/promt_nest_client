'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: "Is PromptNest free to use?", a: "Yes, our core library is completely free. We also offer a Pro tier for creators who want exclusive, battle-tested advanced prompts." },
    { q: "Can I sell my own prompts?", a: "Absolutely. Verified Creators can monetize their high-quality prompts and earn a majority share of the revenue." },
    { q: "Does this connect to OpenAI/Midjourney automatically?", a: "Currently, we act as a secure repository. In the near future, our API will allow direct execution right from the dashboard." },
    { q: "How is the community moderated?", a: "We have strict quality guidelines and a review system. Low-effort prompts are automatically filtered out to ensure top tier quality." }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 w-full bg-background relative">
      {/* Decorative top border line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <HelpCircle size={14} className="text-primary" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Support</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Questions</span>
          </h2>
          <p className="mt-5 text-lg text-text-secondary font-medium">
            Everything you need to know about the product and billing.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`border rounded-2xl bg-surface overflow-hidden transition-colors duration-300 ${
                  isOpen ? 'border-primary/30 shadow-sm' : 'border-border hover:border-primary/20'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                >
                  <span className={`font-bold text-lg transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-text-primary group-hover:text-primary'}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOpen ? 'bg-primary/10 text-primary' : 'bg-foreground/5 text-text-secondary group-hover:bg-primary/5 group-hover:text-primary'
                    }`}
                  >
                    <ChevronDown size={20} strokeWidth={2.5} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-text-secondary leading-relaxed text-base font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}