import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  X,
  Eye,
  FileCheck,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import {
  compressAndProcessImage,
  isUploadedDataUrl,
  estimateDataUrlSize
} from '../utils/imageUpload';

interface SingleImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  placeholderUrl?: string;
}

export const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  label,
  value,
  onChange,
  helperText = 'Upload a photo from your computer or paste an image link.',
  placeholderUrl = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
}) => {
  const [mode, setMode] = useState<'upload' | 'link'>(isUploadedDataUrl(value) ? 'upload' : 'link');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploaded = isUploadedDataUrl(value);
  const sizeEstimate = isUploaded ? estimateDataUrlSize(value) : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await compressAndProcessImage(file, 1600, 1200, 0.85);
      onChange(result.dataUrl);
      setMode('upload');
    } catch (err: any) {
      setErrorMessage(`Failed to process photo: ${err.message}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          {label}
        </label>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#173F35] bg-[#173F35]/10 hover:bg-[#173F35]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('link')}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
              mode === 'link'
                ? 'bg-stone-200 text-stone-900 border-stone-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-[#17324D]" />
            <span>Link</span>
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-stone-500">{helperText}</p>
      )}

      {errorMessage && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMessage}
          </span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-stone-400">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          <span>Optimizing uploaded photo...</span>
        </div>
      )}

      {/* Preview & Input Row */}
      <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
        <div
          onClick={() => value && setShowPreview(true)}
          className="relative group w-16 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300 cursor-pointer shadow-2xs"
          title="Click to preview"
        >
          {value ? (
            <img
              src={value}
              alt="Cover Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
          {value && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Eye className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {mode === 'upload' && isUploaded ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-stone-700">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-800 text-xs truncate">
                  Local Photo Uploaded ({sizeEstimate})
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-[#173F35] underline decoration-[#E99B54] hover:text-[#1F4F43]"
              >
                Change Photo
              </button>
            </div>
          ) : (
            <input
              type="url"
              value={isUploaded ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholderUrl}
              className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            />
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-stone-400 hover:text-red-500 rounded"
            title="Clear image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showPreview && value && (
        <div
          onClick={() => setShowPreview(false)}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl max-h-[85vh] bg-stone-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative"
          >
            <div className="flex items-center justify-between p-3 bg-black/50 text-white text-xs">
              <span>Photo Preview</span>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center">
              <img
                src={value}
                alt="Enlarged"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
