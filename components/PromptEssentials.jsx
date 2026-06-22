'use client';
import { CheckCircle, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PromptEssentials() {
  return (
    <section className="py-20 md:py-28 bg-background text-text-primary overflow-hidden relative transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 z-10">
            <div className="space-y-4">
              
              {/* Premium Badge (Baki section gular sathe perfectly match korbe) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[10px] md:text-xs font-black text-text-secondary uppercase tracking-widest">Learn & Grow</span>
              </div>

              {/* Title updated with Premium SaaS Gradient */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-tight">
                Prompt Engineering <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Essentials</span>
              </h2>
              <p className="text-text-secondary text-lg sm:text-[19px] leading-relaxed max-w-2xl mt-6 font-medium">
                Writing high-performing prompts is a science. AI tools require structures that define context, role constraints, output formats, and temperature.
              </p>
            </div>

            <div className="space-y-6 mt-10">
              {/* Feature 1 */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors duration-300">Define the Persona</h4>
                  <p className="text-text-secondary text-[15px] leading-relaxed">Start by assigning a specific role e.g., "Act as a Senior UX Engineer".</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent transition-colors duration-300">Provide Clear Context</h4>
                  <p className="text-text-secondary text-[15px] leading-relaxed">Supply background constraints, input schemas, and targeted output formats.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors duration-300">Iterative Refining</h4>
                  <p className="text-text-secondary text-[15px] leading-relaxed">Toggle instructions for formatting (e.g. Markdown, JSON) to guide responses.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/all-prompts" className="inline-flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all duration-300 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:scale-95">
                <BookOpen className="w-5 h-5" />
                Explore Guide Prompts
              </Link>
            </div>
          </div>

          {/* Right Content - Code Window */}
          <div className="relative z-10 lg:ml-8 mt-12 lg:mt-0 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 -z-10"></div>
            
            <div className="rounded-[24px] overflow-hidden bg-[#0A0A0F] border border-[#22222D] shadow-2xl relative z-20 transition-transform duration-500 hover:-translate-y-2">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="bg-[#111116] px-6 py-4 border-b border-[#22222D] flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm"></div>
                </div>
                <div className="flex-1 text-center font-mono text-[11px] font-bold text-gray-400 opacity-80 mr-12 tracking-widest uppercase">
                  structured_prompt.json
                </div>
              </div>
              
              <div className="p-6 sm:p-8 overflow-x-auto">
                <pre className="font-mono text-[13px] sm:text-[15px] leading-loose">
                  <code className="text-gray-300">
{`{
  `}</code><code className="text-[#A78BFA]">"role"</code><code className="text-gray-300">{`: `}</code><code className="text-[#34D399]">"Senior React Architect"</code><code className="text-gray-300">{`,
  `}</code><code className="text-[#A78BFA]">"context"</code><code className="text-gray-300">{`: `}</code><code className="text-[#34D399]">"Optimizing a landing page"</code><code className="text-gray-300">{`,
  `}</code><code className="text-[#A78BFA]">"instructions"</code><code className="text-gray-300">{`: [
    `}</code><code className="text-[#38BDF8]">"Use HSL variable colors"</code><code className="text-gray-300">{`,
    `}</code><code className="text-[#38BDF8]">"Apply Glassmorphism cards"</code><code className="text-gray-300">{`,
    `}</code><code className="text-[#38BDF8]">"Verify mobile responsiveness"</code><code className="text-gray-300">{`
  ],
  `}</code><code className="text-[#A78BFA]">"format"</code><code className="text-gray-300">{`: `}</code><code className="text-[#F472B6]">"Vanilla CSS + HTML"</code><code className="text-gray-300">{`,
  `}</code><code className="text-[#A78BFA]">"temperature"</code><code className="text-gray-300">{`: `}</code><code className="text-[#FBBF24]">0.2</code><code className="text-gray-300">{`
}`}</code>
                </pre>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}