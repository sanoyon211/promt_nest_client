'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-surface border border-primary/20 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl"></div>

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary"
          >
            <Sparkles size={32} />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            Ready to Supercharge Your Workflow?
          </h2>
          
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of creators and professionals. Get instant access to the world's most advanced prompt library or start monetizing your own prompt engineering skills today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/all-prompts" className="w-full sm:w-auto bg-primary text-background font-bold px-8 py-4 rounded-xl flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
              Explore Prompts
              <ArrowRight size={20} className="ml-2" />
            </Link>
            
            <Link href="/register" className="w-full sm:w-auto bg-surface text-foreground font-bold px-8 py-4 rounded-xl border border-foreground/10 flex items-center justify-center hover:bg-foreground/5 hover:scale-105 transition-all">
              Become a Creator
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
