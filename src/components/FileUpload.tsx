import React, { useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';

const ACCEPTED_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/json',
];

interface FileUploadProps {
  file: File | null;
  onFileUpload: (file: File) => void;
}

export default function FileUpload({ file, onFileUpload }: FileUploadProps) {
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploading(true);
    setUploaded(false);
    setProgress(0);
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploaded(true);
          onFileUpload(file);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  return (
    <>
      <button
        className="mx-auto block px-8 py-3 rounded-2xl bg-gradient-to-br from-violet via-cyan to-purple shadow-lg hover:shadow-[0_0_20px_#8B5CF6] text-white font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-200 border-none focus:outline-none"
        onClick={() => setOpen(true)}
        type="button"
      >
        <UploadCloud className="w-6 h-6" />
        {file ? 'Replace File' : 'Upload Document'}
      </button>
      <Transition show={open} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <AnimatePresence>
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative w-full max-w-lg mx-auto rounded-3xl bg-gradient-to-br from-glass to-glass2 border border-white/10 shadow-2xl p-8 backdrop-blur-md flex flex-col items-center gap-6"
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white bg-glass p-2 rounded-full focus:outline-none"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
                <div
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl p-10 transition-colors ${dragActive ? 'border-cyan bg-glass2' : 'border-white/10 bg-glass'}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv, .xlsx, .json"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <UploadCloud className="w-14 h-14 text-cyan-400 drop-shadow-lg mb-2" />
                  <p className="text-gray-200 mb-2 text-lg font-semibold">Drag & drop your CSV, Excel, or JSON file here, or <span className="text-cyan-400 underline">browse</span></p>
                  {file && <div className="mt-2 text-cyan-300 font-medium">Selected: {file.name}</div>}
                </div>
                {uploading && (
                  <div className="w-full mt-4">
                    <div className="h-3 rounded-full bg-glass2 border border-cyan/30 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan to-violet rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-cyan-300 text-center mt-2 text-sm font-mono">Uploading... {progress}%</div>
                  </div>
                )}
                {uploaded && (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <CheckCircle2 className="w-10 h-10 text-cyan-400 animate-bounce" />
                    <div className="text-cyan-300 font-semibold">Upload complete!</div>
                  </div>
                )}
                <button
                  className="mt-6 w-full py-3 px-4 rounded-2xl bg-gradient-to-br from-violet via-cyan to-purple hover:shadow-[0_0_20px_#8B5CF6] text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-200 border-none focus:outline-none"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Done
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 