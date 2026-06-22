'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Lock, Zap, Send, FileText, Upload, X, ChevronDown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'dummy_imgbb_key';

export default function EditPromptPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  
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
  const [isFetching, setIsFetching] = useState(true);

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

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id || !user) return;
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/prompts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Ensure the user owns this prompt
          if (data.creatorEmail !== user.email) {
            toast.error("You don't have permission to edit this prompt.");
            router.push('/dashboard/prompts');
            return;
          }
          
          setFormData({
            title: data.title || '',
            description: data.description || '',
            content: data.content || '',
            category: data.category || 'Coding',
            aiTool: data.aiTool || 'ChatGPT',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            difficulty: data.difficultyLevel || 'Beginner',
            visibility: data.visibility || 'Public'
          });
          setImagePreview(data.thumbnailImage || '');
          
          // Handle custom categories/tools
          if (!categories.includes(data.category)) {
            setFormData(prev => ({ ...prev, category: 'Other' }));
            setCustomCategory(data.category);
          }
          if (!aiTools.includes(data.aiTool)) {
            setFormData(prev => ({ ...prev, aiTool: 'Other' }));
            setCustomAiTool(data.aiTool);
          }
          
        } else {
          toast.error("Failed to fetch prompt details.");
          router.push('/dashboard/prompts');
        }
      } catch (error) {
        console.error("Error fetching prompt:", error);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchPrompt();
  }, [id, user, categories, aiTools, router]);

  if (!user || isFetching) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  const isPremium = user.subscription === 'Premium';

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
    setImagePreview(''); // If user saves, this will pass empty string (needs to be handled if they want to keep old)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let uploadedImageUrl = imagePreview; // Keep existing if not changed
    
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

      // Format payload
      const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
      const finalAiTool = formData.aiTool === 'Other' ? customAiTool : formData.aiTool;

      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: finalCategory,
        aiTool: finalAiTool,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        difficultyLevel: formData.difficulty,
        visibility: formData.visibility,
        thumbnailImage: uploadedImageUrl
      };

      const token = localStorage.getItem('access-token');
      const res = await fetch(`${API_URL}/prompts/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to update prompt');
      
      toast.success('Prompt updated successfully!', { position: "bottom-right", theme: "dark" });
      setTimeout(() => {
        router.refresh();
        router.push('/dashboard/prompts');
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error updating prompt.', { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">
      
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
          <FileText size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Edit Prompt</h1>
          <p className="text-text-secondary font-medium mt-1">Update your existing prompt details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none space-y-8">
        
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[13px] font-bold text-text-primary uppercase tracking-wider">Prompt Payload *</label>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">Use [Brackets] for variables</span>
          </div>
          
          <div className="relative group rounded-xl overflow-hidden bg-[#09090B] border border-border/50 shadow-inner">
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

        <div className="pt-8 mt-8 border-t border-border flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-primary text-white font-bold text-[15px] rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Update Prompt
              </>
            )}
          </button>
        </div>
        
      </form>

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
    </div>
  );
}
