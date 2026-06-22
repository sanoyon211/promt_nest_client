'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden w-full bg-background">
      {/* Section Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-surface/80 backdrop-blur-2xl border border-border rounded-[40px] p-10 md:p-16 lg:p-20 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none relative overflow-hidden group"
        >
          {/* Animated Decorative Orbs */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000 ease-out pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000 ease-out pointer-events-none"></div>

          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <Sparkles size={32} className="text-primary" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 tracking-tight relative z-10">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Supercharge</span> Your Workflow?
          </h2>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-medium relative z-10">
            Join thousands of creators and professionals. Get instant access to the world's most advanced prompt library or start monetizing your own prompt engineering skills today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
            <Link 
              href="/all-prompts" 
              className="w-full sm:w-auto bg-primary text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] group/btn"
            >
              Explore Prompts
              <ArrowRight size={20} strokeWidth={2.5} className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-surface text-text-primary font-bold px-8 py-4 rounded-xl border-2 border-border flex items-center justify-center hover:bg-foreground/5 hover:border-text-secondary hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Become a Creator
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
