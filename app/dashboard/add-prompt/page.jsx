'use client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Lock, Zap, Send, FileText, Upload, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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

  // Still loading auth state
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subscription = user.subscription || 'Free';
  const totalPrompts = user.totalPrompts || 0;
  
  // Strict Quota Logic implementation
  const hasReachedQuota = subscription !== 'Premium' && totalPrompts >= 3;

  if (hasReachedQuota) {
    return (
      <div className="max-w-2xl mx-auto w-full py-16 px-4">
        <div className="bg-surface border border-red-500/20 rounded-3xl p-8 shadow-xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-red-500" />
          </div>
          
          <h1 className="text-3xl font-black text-foreground mb-4">Prompt Quota Reached</h1>
          <p className="text-foreground/70 mb-8 max-w-md mx-auto leading-relaxed">
            Free tier users are limited to creating a maximum of 3 prompts. You have currently published {totalPrompts} prompts. 
            Upgrade to Premium to unlock unlimited prompt creation!
          </p>
          
          <Link 
            href="/payment" 
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white text-lg font-bold rounded-xl hover:scale-105 transition-transform shadow-xl shadow-accent/30 w-full sm:w-auto"
          >
            <Zap size={20} className="mr-2 fill-current" />
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
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
      const payload = {
        ...formData,
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to create prompt');
      
      toast.success('Prompt submitted successfully! Pending approval.');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error submitting prompt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8 flex items-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mr-4 shadow-inner">
          <FileText size={28} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Create New Prompt</h1>
          <p className="text-foreground/60 text-sm mt-1">Share your best AI prompts with the community.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-foreground/10 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Prompt Title *</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. SEO Optimized Blog Generator"
            required
            className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary text-foreground transition-colors shadow-inner"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Short Description *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly explain what this prompt does..."
            required
            className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3.5 min-h-[100px] focus:outline-none focus:border-primary text-foreground transition-colors resize-y shadow-inner"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Prompt Content *</label>
          <textarea 
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Act as a senior copywriter. Write a..."
            required
            className="w-full bg-[#1E1B2E] border border-foreground/10 rounded-xl px-5 py-4 min-h-[250px] focus:outline-none focus:border-primary text-gray-300 transition-colors font-mono text-sm resize-y shadow-inner leading-relaxed"
          />
          <p className="text-xs text-foreground/50 mt-2 flex justify-end">Variables like [INSERT KEYWORD] are recommended.</p>
        </div>

        {/* 4-Column Grid for Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary text-foreground transition-colors"
            >
              <option value="Coding">Coding</option>
              <option value="Marketing">Marketing</option>
              <option value="SEO">SEO</option>
              <option value="Copywriting">Copywriting</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">AI Tool</label>
            <select 
              name="aiTool"
              value={formData.aiTool}
              onChange={handleChange}
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary text-foreground transition-colors"
            >
              <option value="ChatGPT">ChatGPT</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="Midjourney">Midjourney</option>
              <option value="Gemini">Gemini</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Difficulty</label>
            <select 
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary text-foreground transition-colors"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Visibility</label>
            <select 
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary text-foreground transition-colors"
            >
              <option value="Public">Public (Free for all)</option>
              <option value="Private">Private (Premium Only)</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Tags (Comma Separated)</label>
          <input 
            type="text" 
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. javascript, react, frontend"
            className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary text-foreground transition-colors shadow-inner"
          />
        </div>

        {/* Thumbnail Image Upload */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Thumbnail Image (Optional)</label>
          {!imagePreview ? (
            <div className="w-full bg-background border-2 border-dashed border-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload size={24} className="text-foreground/40 mb-2" />
              <p className="text-sm text-foreground/60">Click or drag image to upload</p>
              <p className="text-xs text-foreground/40 mt-1">Max size: 5MB</p>
            </div>
          ) : (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-48 rounded-xl object-cover border border-foreground/10 shadow-sm" />
              <button 
                type="button"
                onClick={removeImage}
                className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-8 mt-8 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-foreground/50 mb-4 sm:mb-0">
            Note: All new prompts are set to <span className="font-bold text-yellow-500">Pending</span> status for review.
          </p>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-primary text-background font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-background mr-3"></div>
            ) : (
              <Send size={20} className="mr-3" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
          </button>
        </div>
        
      </form>
    </div>
  );
}
