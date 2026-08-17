import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Image as ImageIcon, Send, ChevronDown, Loader2 } from 'lucide-react';
import api from '../../services/api';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Doubt Sharing");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsLoading(true);
    try {
      // Split tags by comma and trim whitespace
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const form = new FormData();
      form.append('title', title);
      form.append('content', content);
      form.append('category', category);
      form.append('type', 'Post');
      form.append('tags', JSON.stringify(tagsArray));
      attachments.forEach(file => form.append('attachments', file));

      const res = await api.post('/posts/create', form);
      
      if (res.data && res.data.data) {
        if (onPostCreated) {
          onPostCreated(res.data.data);
        }
        // Reset form
        setTitle("");
        setContent("");
        setTags("");
        setCategory("Doubt Sharing");
        setAttachments([]);
        onClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // You might want to show an error message here
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setAttachments(prev => [...prev, ...files]);
    }
  };
  
  const removeAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const inputClasses = "w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white/80 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-800 placeholder-gray-400 font-medium shadow-sm hover:bg-white/60 text-base";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60]"
          />

          {/* Modal Container - Mobile First Design */}
          <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[70] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="w-full sm:max-w-2xl bg-white/95 sm:bg-white/90 backdrop-blur-2xl rounded-t-3xl sm:rounded-[2.5rem] shadow-2xl border-t border-white sm:border border-white pointer-events-auto overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            >
              {/* Mobile Header */}
              <div className="sm:hidden sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-lg font-bold text-gray-800">Create Post</h2>
                <button 
                  onClick={handleSubmit}
                  disabled={!title.trim() || !content.trim() || isLoading}
                  className="bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Post'}
                </button>
              </div>

              {/* Desktop Header */}
              <div className="hidden sm:block p-6 lg:p-8 pb-2">
                <div className="flex items-center gap-4 bg-gray-50/50 rounded-full px-5 py-2.5 border border-gray-100/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200 shrink-0">
                    <Plus size={22} />
                  </div>
                  <div className="flex-1 text-gray-500 font-bold text-lg">
                    Create New Post
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Form Fields - Scrollable Content */}
              <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 overflow-y-auto">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's your post about?" 
                    className={inputClasses}
                    autoFocus={false}
                  />
                </div>

                {/* Content Textarea */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Content</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts with the community..." 
                    rows={window.innerWidth < 640 ? 4 : 5}
                    className={`${inputClasses} resize-none min-h-[120px] sm:min-h-[140px]`}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`${inputClasses} appearance-none cursor-pointer pr-12`}
                    >
                      <option>Doubt Sharing</option>
                      <option>Knowledge Base</option>
                      <option>Inspiration</option>
                      <option>Event Announcement</option>
                    </select>
                    <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tags (Optional)</label>
                  <input 
                    type="text" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. react, javascript, help" 
                    className={inputClasses}
                  />
                </div>
                
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Attachments</label>
                    <div className="flex flex-wrap gap-3">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                          <span className="text-gray-600 text-sm font-medium truncate max-w-[160px]">{file.name}</span>
                          <button onClick={() => removeAttachment(idx)} className="text-red-500 font-bold">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions - Desktop Only */}
              <div className="hidden sm:flex p-6 lg:p-8 pt-4 border-t border-gray-100 bg-gray-50/50 items-center justify-between">
                <div className="flex items-center gap-4">
                  <label 
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold transition-colors px-4 py-2 rounded-xl hover:bg-orange-50 cursor-pointer"
                  >
                    <ImageIcon size={22} />
                    <span>Add Image</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                  </label>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim() || isLoading}
                    className="flex items-center gap-3 bg-orange-600 disabled:bg-gray-300 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <span>Post Now</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Footer - Sticky Bottom */}
              <div className="sm:hidden sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <label 
                    className="flex items-center justify-center gap-2 text-gray-500 hover:text-orange-600 font-semibold transition-colors px-4 py-3 rounded-xl hover:bg-orange-50 flex-shrink-0 cursor-pointer"
                  >
                    <ImageIcon size={20} />
                    <span className="text-sm">Image</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                  </label>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim() || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-200/50 hover:bg-orange-700 transition-all disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span>Share Post</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
