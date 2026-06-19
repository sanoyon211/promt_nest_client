'use client';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, Layers } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    { icon: <Shield size={32} />, title: "Enterprise Security", desc: "Your prompts are encrypted and securely stored. We respect your intellectual property." },
    { icon: <Sparkles size={32} />, title: "Curated Quality", desc: "Every prompt in our premium tier is rigorously tested for accuracy and effectiveness." },
    { icon: <Zap size={32} />, title: "Instant Execution", desc: "Copy, paste, or trigger prompts via our seamless modular API in milliseconds." },
    { icon: <Layers size={32} />, title: "Cross-Model Support", desc: "Organize prompts for ChatGPT, Claude, Midjourney, and more all in one unified dashboard." }
  ];

  return (
    <section className="py-24 w-full bg-surface/50 border-y border-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Why Choose PromtNest?</h2>
          <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">Built for creators, developers, and teams who demand the highest quality AI outputs.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 bg-background rounded-3xl border border-foreground/10 hover:border-primary/30 transition-all shadow-sm group hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
