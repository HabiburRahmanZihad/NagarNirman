"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle, Camera, Sparkles, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

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
      toast.error("Maximum 5 images allowed");
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
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ images, note });
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
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
          className="absolute inset-0 bg bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 bg-linear-to-r from-green-500 to-green-600 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Submit Completion Proof</h2>
                <p className="text-green-100 text-sm mt-1">Task: {task.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Reward Banner */}
            <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-sm text-black">You will earn</p>
                    <p className="text-lg font-bold text-yellow-600">{task.rewardPoints} Reward Points</p>
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <div className="flex items-center mb-3">
                  <Camera className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-bold text-gray-800">Upload Completion Photos</h3>
                  <span className="ml-2 text-sm text-gray-500">({images.length}/5)</span>
                </div>
                
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
                  whileHover={{ scale: 1.01 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? 'border-green-500 bg-green-50'
                      : images.length > 0
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-green-400'
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium text-sm mb-1">
                    {isDragging ? "Drop your images here" : "Click or drag images to upload"}
                  </p>
                  <p className="text-gray-500 text-xs">PNG, JPG up to 5MB each • Maximum 5 photos</p>
                </motion.div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">Selected Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                            className="w-full h-24 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
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
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-bold text-gray-800">Additional Notes</h3>
                  <span className="ml-2 text-sm font-normal text-gray-500">(Optional)</span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe the work you completed, any challenges you faced, materials used, or additional information that might help with verification..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none text-sm"
                />
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Verification Tips
                </h4>
                <ul className="text-blue-700 text-xs space-y-1">
                  <li>• Include both before and after photos showing the improvement</li>
                  <li>• Make sure photos are clear and well-lit</li>
                  <li>• Show the entire affected area in your photos</li>
                  <li>• Include timestamps if possible</li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: images.length === 0 ? 1 : 1.02 }}
              whileTap={{ scale: images.length === 0 ? 1 : 0.98 }}
              onClick={handleSubmit}
              disabled={images.length === 0 || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                images.length === 0 || isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Proof</span>
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}