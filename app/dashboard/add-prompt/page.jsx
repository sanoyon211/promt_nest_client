'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Lock, Zap, Send, FileText, Upload, X, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'dummy_imgbb_key';

export default function AddPromptPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Coding',
    aiTool: 'ChatGPT',
    tags: '',
    difficulty: 'Beginner',
    visibility: 'Public'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Dynamic filter states
  const [categories, setCategories] = useState(['Coding', 'Marketing', 'SEO', 'Copywriting', 'Design', 'Business']);
  const [aiTools, setAiTools] = useState(['ChatGPT', 'Claude 3.5 Sonnet', 'Midjourney', 'Gemini']);
  const [customCategory, setCustomCategory] = useState('');
  const [customAiTool, setCustomAiTool] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${API_URL}/prompts/filters`);
        if (res.ok) {
          const data = await res.json();
          // Merge default ones with fetched ones, exclude 'All'
          const mergedCategories = Array.from(new Set(['Coding', 'Marketing', 'SEO', 'Copywriting', 'Design', 'Business', ...data.categories.filter(c => c !== 'All')]));
          const mergedTools = Array.from(new Set(['ChatGPT', 'Claude 3.5 Sonnet', 'Midjourney', 'Gemini', ...data.aiTools.filter(t => t !== 'All')]));
          
          setCategories(mergedCategories);
          setAiTools(mergedTools);
        }
      } catch (error) {
        console.error("Failed to fetch filters", error);
      }
    };
    fetchFilters();
  }, []);

  // Still loading auth state
  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  const subscription = user.subscription || 'Free';
  const isPremium = subscription === 'Premium';
  const totalPrompts = user.totalPrompts || 0;
  
  // Strict Quota Logic implementation (Admin bypasses quota)
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const hasReachedQuota = !isPremium && !isAdmin && totalPrompts >= 3;

  if (hasReachedQuota) {
    return (
      <div className="max-w-2xl mx-auto w-full py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-surface border border-red-500/20 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden text-center"
        >
          {/* Cinematic Red Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/20 shadow-inner">
            <Lock size={32} className="text-red-500" />
          </div>
          
          <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">Creation Quota Reached</h1>
          <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed font-medium">
            Free tier creators are limited to a maximum of 3 prompts. You have successfully published <strong className="text-text-primary">{totalPrompts}</strong> prompts. 
            Upgrade to Premium to unlock unlimited prompt creation!
          </p>
          
          <Link 
            href="/pricing?redirect=/dashboard/add-prompt" 
            className="inline-flex items-center justify-center px-8 py-4 bg-text-primary text-background text-lg font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl w-full sm:w-auto"
          >
            <Zap size={20} className="mr-2 text-accent fill-accent" />
            Upgrade to Premium
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB", { position: "bottom-right", theme: "dark" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let uploadedImageUrl = '';
    
    try {
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formDataUpload
        });
        
        const imgbbData = await imgbbResponse.json();
        if (imgbbData.success) {
          uploadedImageUrl = imgbbData.data.display_url;
        } else {
          throw new Error('Image upload failed via ImgBB');
        }
      }

      // Format payload with specific requested defaults
      const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
      const finalAiTool = formData.aiTool === 'Other' ? customAiTool : formData.aiTool;

      const payload = {
        ...formData,
        category: finalCategory,
        aiTool: finalAiTool,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        tier: formData.visibility, // Map UI terminology to Backend terminology
        status: 'pending',
        copyCount: 0,
        thumbnailImage: uploadedImageUrl
      };

      const token = localStorage.getItem('access-token');
      const res = await fetch(`${API_URL}/prompts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403 || errorData.message?.includes('maximum of 3 prompts')) {
          setShowUpgradeModal(true);
          setIsSubmitting(false);
          return;
        }
        throw new Error(errorData.message || 'Failed to create prompt');
      }
      
      toast.success('Prompt submitted successfully! Pending approval.', { position: "bottom-right", theme: "dark" });
      setTimeout(() => {
        router.refresh();
        router.push('/dashboard/prompts');
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error submitting prompt.', { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">
      
      {/* Header section */}
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
          <FileText size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Creator Studio</h1>
          <p className="text-text-secondary font-medium mt-1">Publish your best AI workflows to the community.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none space-y-8">
        
        {/* Title */}
        <div>
          <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">Prompt Title *</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Ultimate SEO Blog Generator"
            required
            className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-[15px] font-medium text-text-primary transition-all placeholder:text-text-secondary/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">Short Description *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly explain what this prompt does and its main benefits..."
            required
            className="w-full bg-background border border-border rounded-xl px-5 py-4 min-h-[100px] focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-[15px] font-medium text-text-primary transition-all resize-y placeholder:text-text-secondary/50"
          />
        </div>

        {/* Prompt Content (Code Editor Style) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider">Prompt Payload *</label>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">Use [Brackets] for variables</span>
          </div>
          
          <div className="relative group rounded-xl overflow-hidden bg-[#09090B] border border-border/50 shadow-inner">
            {/* Fake Editor Top Bar */}
            <div className="w-full h-10 bg-white/5 border-b border-white/10 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
              </div>
              <span className="ml-auto text-[10px] text-white/30 font-mono tracking-widest uppercase">prompt.txt</span>
            </div>
            
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Act as a senior copywriter. I want you to write a [TYPE OF COPY] about [TOPIC]..."
              required
              className="w-full bg-transparent border-none px-5 py-5 min-h-[250px] focus:outline-none focus:ring-0 text-gray-300 font-mono text-[14px] resize-y leading-relaxed placeholder:text-gray-600 custom-scrollbar"
            />
          </div>
        </div>

        {/* 4-Column Grid for Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative flex flex-col">
            <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">Category</label>
            <div className="relative">
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full appearance-none bg-background border border-border rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-text-primary text-[14px] font-medium transition-all cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other (Add Custom...)</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
            {formData.category === 'Other' && (
              <input 
                type="text" 
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type new category..."
                required
                className="w-full mt-3 bg-background border border-primary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-[14px] font-medium text-text-primary transition-all placeholder:text-text-secondary/50 shadow-[0_0_15px_rgba(79,70,229,0.1)]"
              />
            )}
          </div>

          <div className="relative flex flex-col">
            <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">AI Tool</label>
            <div className="relative">
              <select 
                name="aiTool"
                value={formData.aiTool}
                onChange={handleChange}
                className="w-full appearance-none bg-background border border-border rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-text-primary text-[14px] font-medium transition-all cursor-pointer"
              >
                {aiTools.map(t => <option key={t} value={t}>{t}</option>)}
                <option value="Other">Other (Add Custom...)</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
            {formData.aiTool === 'Other' && (
              <input 
                type="text" 
                value={customAiTool}
                onChange={(e) => setCustomAiTool(e.target.value)}
                placeholder="Type new AI tool..."
                required
                className="w-full mt-3 bg-background border border-primary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-[14px] font-medium text-text-primary transition-all placeholder:text-text-secondary/50 shadow-[0_0_15px_rgba(79,70,229,0.1)]"
              />
            )}
          </div>

          <div className="relative">
            <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">Difficulty</label>
            <div className="relative">
              <select 
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full appearance-none bg-background border border-border rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-text-primary text-[14px] font-medium transition-all cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                {isPremium ? (
                  <option value="Pro">Pro (Premium)</option>
                ) : (
                  <option value="Pro" disabled>Pro (Premium Only)</option>
                )}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">Visibility</label>
            <div className="relative">
              <select 
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full appearance-none bg-background border border-border rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-text-primary text-[14px] font-medium transition-all cursor-pointer"
              >
                <option value="Public">Public (Free)</option>
                {isPremium ? (
                  <option value="Private">Private (Premium)</option>
                ) : (
                  <option value="Private" disabled>Private (Premium Only)</option>
                )}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">Tags</label>
          <input 
            type="text" 
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. javascript, react, frontend (comma separated)"
            className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-[15px] font-medium text-text-primary transition-all placeholder:text-text-secondary/50"
          />
        </div>

        {/* Thumbnail Image Upload */}
        <div>
          <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2">Cover Image (Optional)</label>
          {!imagePreview ? (
            <div className="w-full bg-background/50 border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                <Upload size={24} className="text-text-secondary group-hover:text-primary transition-colors" />
              </div>
              <p className="text-[15px] font-medium text-text-primary mb-1">Click or drag image to upload</p>
              <p className="text-xs font-medium text-text-secondary/60 uppercase tracking-widest">Max size: 5MB</p>
            </div>
          ) : (
            <div className="relative inline-block group">
              <img src={imagePreview} alt="Preview" className="h-[200px] w-auto max-w-full rounded-2xl object-cover border border-border shadow-sm" />
              <button 
                type="button"
                onClick={removeImage}
                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-text-primary text-background rounded-full hover:scale-110 shadow-lg transition-transform z-10"
                title="Remove image"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-8 mt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-text-secondary">
            Note: All submissions are set to <span className="font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md ml-1">Pending</span> for review.
          </p>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-primary text-white font-bold text-[15px] rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Publish Prompt
              </>
            )}
          </button>
        </div>
        
      </form>

      {/* Styles for custom scrollbar in Editor */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2); 
        }
      `}} />

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden text-center"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-6 right-6 p-2 text-text-secondary hover:text-text-primary bg-background border border-border rounded-full transition-colors hover:bg-foreground/5 active:scale-95"
              >
                <X size={18} />
              </button>
              
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/20 shadow-inner">
                <Zap size={32} className="text-accent fill-accent" />
              </div>
              
              <h2 className="text-2xl font-black text-text-primary mb-3 tracking-tight">Upgrade to Premium</h2>
              <p className="text-[14px] text-text-secondary font-medium mb-8">
                You've reached the free tier limit of 3 prompts. Upgrade your account to unlock unlimited prompt creation!
              </p>
              
              <Link 
                href="/payment?redirect=/dashboard/add-prompt"
                className="flex items-center justify-center px-6 py-4 bg-primary text-white text-[15px] font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:scale-95"
              >
                Upgrade Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
