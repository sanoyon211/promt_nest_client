'use client';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, Layers, Cpu } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    { 
      icon: <Shield size={28} />, 
      title: "Enterprise-Grade Security", 
      desc: "Your prompts are encrypted and securely stored. We respect your intellectual property with zero-data-retention policies on our core servers.",
      span: "md:col-span-2 lg:col-span-2",
      bgStyle: "bg-gradient-to-br from-primary/5 via-surface to-surface",
      iconBg: "bg-primary/10 text-primary",
      watermark: <Shield size={160} strokeWidth={1} />
    },
    { 
      icon: <Sparkles size={28} />, 
      title: "Curated Quality", 
      desc: "Every prompt in our premium tier is rigorously tested for accuracy.",
      span: "md:col-span-1 lg:col-span-1",
      bgStyle: "bg-gradient-to-bl from-accent/5 via-surface to-surface",
      iconBg: "bg-accent/10 text-accent",
      watermark: <Sparkles size={140} strokeWidth={1} />
    },
    { 
      icon: <Zap size={28} />, 
      title: "Instant API", 
      desc: "Copy, paste, or trigger prompts via our seamless modular API in milliseconds.",
      span: "md:col-span-1 lg:col-span-1",
      bgStyle: "bg-gradient-to-tr from-accent/5 via-surface to-surface",
      iconBg: "bg-accent/10 text-accent",
      watermark: <Zap size={140} strokeWidth={1} />
    },
    { 
      icon: <Layers size={28} />, 
      title: "Cross-Model Support", 
      desc: "Organize prompts for ChatGPT, Claude, Midjourney, and more all in one unified dashboard. Switch contexts without losing your workflow.",
      span: "md:col-span-2 lg:col-span-2",
      bgStyle: "bg-gradient-to-tl from-primary/5 via-surface to-surface",
      iconBg: "bg-primary/10 text-primary",
      watermark: <Layers size={160} strokeWidth={1} />
    }
  ];

  return (
    <section className="py-24 w-full bg-background relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <Cpu size={14} className="text-text-secondary" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">PromptNest?</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium">
            Built for creators, developers, and teams who demand the highest quality AI outputs without the friction.
          </p>
        </motion.div>

        {/* Premium Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-min">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-[32px] p-8 md:p-10 border border-border transition-all duration-500 hover:border-primary/30 group ${feature.span} ${feature.bgStyle}`}
            >
              {/* Abstract Watermark Icon in Background */}
              <div className="absolute -bottom-6 -right-6 text-foreground/5 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 pointer-events-none">
                {feature.watermark}
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-sm transition-transform duration-500 group-hover:scale-110 ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed font-medium mt-auto max-w-md">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}