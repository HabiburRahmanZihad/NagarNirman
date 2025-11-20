// components/solver/ProofUploadModal.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image, FileText, CheckCircle, Camera, Sparkles, Trash2 } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  rewardPoints: number;
}

interface ProofUploadModalProps {
  task: Task;
  onClose: () => void;
  onSubmit: (proofData: { images: File[]; note: string }) => void;
}

export default function ProofUploadModal({ task, onClose, onSubmit }: ProofUploadModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ images, note });
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Mission Complete! 🎉</h2>
                <p className="text-green-100 mt-1">Submit proof for: {task.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Reward Banner */}
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <div>
                    <p className="font-semibold">You're about to earn</p>
                    <p className="text-2xl font-bold">{task.rewardPoints} Reward Points</p>
                  </div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-300" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Image Upload */}
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                <Camera className="w-5 h-5 text-green-600 mr-2" />
                Upload Completion Photos
                <span className="ml-2 text-sm text-gray-500">({images.length}/5)</span>
              </h3>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              {/* Upload Area */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-green-500 bg-green-50 scale-105'
                    : images.length > 0
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-green-400'
                }`}
              >
                <motion.div
                  animate={{ y: isDragging ? 2 : 0 }}
                  transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0, repeatType: "reverse" }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                </motion.div>
                <p className="text-gray-600 font-medium text-lg mb-2">
                  {isDragging ? "Drop your images here" : "Click or drag images to upload"}
                </p>
                <p className="text-gray-500">PNG, JPG up to 5MB each • Maximum 5 photos</p>
                <p className="text-green-600 text-sm mt-2 font-medium">
                  📸 Take clear before/after photos for faster verification
                </p>
              </motion.div>

              {/* Image Previews */}
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <h4 className="font-semibold text-gray-700 mb-3">Selected Photos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                Additional Notes
                <span className="ml-2 text-sm font-normal text-gray-500">(Optional)</span>
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe the work you completed, any challenges you faced, materials used, or additional information that might help with verification..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none"
              />
              <p className="text-gray-500 text-sm mt-2">
                💡 Helpful notes get verified faster and may earn bonus points!
              </p>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
            >
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Verification Tips
              </h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Include both before and after photos showing the improvement</li>
                <li>• Make sure photos are clear and well-lit</li>
                <li>• Show the entire affected area in your photos</li>
                <li>• Include timestamps if possible</li>
              </ul>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            
            <div className="flex items-center space-x-3">
              {images.length === 0 && (
                <span className="text-sm text-red-500 font-medium">
                  Please add at least one photo
                </span>
              )}
              <motion.button
                whileHover={{ scale: images.length === 0 ? 1 : 1.02 }}
                whileTap={{ scale: images.length === 0 ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={images.length === 0 || isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  images.length === 0 || isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Proof & Earn Points</span>
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}