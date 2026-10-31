import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
  Eye,
  X,
  FileCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  compressAndProcessImage,
  isUploadedDataUrl,
  estimateDataUrlSize
} from '../utils/imageUpload';

interface PhotoUploadManagerProps {
  images: string[];
  onChange: (updatedImages: string[]) => void;
  title?: string;
  description?: string;
  maxPhotos?: number;
}

export const PhotoUploadManager: React.FC<PhotoUploadManagerProps> = ({
  images,
  onChange,
  title = 'Tour Photo Gallery',
  description = 'Add high-resolution photos for this tour. The first image serves as the primary cover hero.',
  maxPhotos = 20,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [activeInputTab, setActiveInputTab] = useState<'both' | 'upload' | 'link'>('both');
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleReplaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  const triggerMultiUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileList.length === 0) {
      setErrorMessage('Please select valid image files (JPG, PNG, WebP, etc.).');
      return;
    }

    if (images.length + fileList.length > maxPhotos) {
      setErrorMessage(`Maximum of ${maxPhotos} photos allowed. You can add up to ${maxPhotos - images.length} more.`);
    }

    const filesToProcess = fileList.slice(0, Math.max(0, maxPhotos - images.length));
    if (filesToProcess.length === 0) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const newlyAdded: string[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      setProcessingStatus(`Optimizing photo ${i + 1} of ${filesToProcess.length} (${file.name})...`);
      try {
        const result = await compressAndProcessImage(file);
        newlyAdded.push(result.dataUrl);
      } catch (err: any) {
        console.error('Failed to process image:', err);
        setErrorMessage(`Could not process "${file.name}": ${err.message || 'Unknown error'}`);
      }
    }

    if (newlyAdded.length > 0) {
      onChange([...images, ...newlyAdded]);
    }

    setIsProcessing(false);
    setProcessingStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSingleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceTargetIndex === null || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) return;

    setIsProcessing(true);
    setProcessingStatus(`Replacing photo with ${file.name}...`);

    try {
      const result = await compressAndProcessImage(file);
      const updated = [...images];
      updated[replaceTargetIndex] = result.dataUrl;
      onChange(updated);
    } catch (err: any) {
      setErrorMessage(`Failed to replace photo: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
      setReplaceTargetIndex(null);
      if (singleReplaceInputRef.current) {
        singleReplaceInputRef.current.value = '';
      }
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setErrorMessage('Please enter a valid image URL starting with https://');
      return;
    }
    onChange([...images, trimmed]);
    setManualUrlInput('');
    setErrorMessage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    onChange(updated);
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [cover] = updated.splice(index, 1);
    updated.unshift(cover);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUrlChange = (index: number, newUrl: string) => {
    const updated = [...images];
    updated[index] = newUrl;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={singleReplaceInputRef}
        onChange={handleSingleReplace}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
      />

      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#173F35]" />
            <span>{title} ({images.length})</span>
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">
            {description}
          </p>
        </div>

        {/* Action Buttons: Upload Photo OR Add Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={triggerMultiUpload}
            disabled={isProcessing || images.length >= maxPhotos}
            className="inline-flex items-center gap-1.5 bg-[#173F35] hover:bg-[#1F4F43] active:scale-95 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveInputTab(activeInputTab === 'link' ? 'both' : 'link')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeInputTab === 'link'
                ? 'bg-stone-200 text-stone-800 border-stone-300'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#17324D]" />
            <span>Add by Link</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-stone-400 hover:text-stone-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Processing Loader Banner */}
      {isProcessing && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs animate-in fade-in">
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
          <div className="flex-1 font-medium">
            <span>{processingStatus || 'Optimizing uploaded image...'}</span>
          </div>
        </div>
      )}

      {/* Manual Link Input Bar (collapsible or toggleable) */}
      {activeInputTab === 'link' && (
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 animate-in fade-in duration-150">
          <label className="block text-[11px] font-bold text-stone-700 uppercase">
            Paste Web Image URL (Unsplash, CDN, or Cloud Hosting)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddManualUrl())}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 text-xs px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
            />
            <button
              type="button"
              onClick={handleAddManualUrl}
              className="bg-[#173F35] hover:bg-[#1F4F43] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Add Link
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerMultiUpload}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#E99B54] bg-[#E99B54]/10 scale-[1.01]'
            : 'border-stone-200 hover:border-[#173F35] bg-stone-50/60 hover:bg-stone-50'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#173F35] border border-stone-200">
            <UploadCloud className="w-5 h-5 text-[#E99B54]" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800">
              Drag & drop photos here, or <span className="text-[#173F35] underline decoration-[#E99B54] underline-offset-2">browse files</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Select one or multiple photos (JPG, PNG, WebP) • Auto-optimized for instant fast loading
            </p>
          </div>
        </div>
      </div>

      {/* List of Photo Cards */}
      <div className="space-y-2.5">
        {images.map((imgUrl, idx) => {
          const isUploaded = isUploadedDataUrl(imgUrl);
          const sizeEstimate = isUploaded ? estimateDataUrlSize(imgUrl) : null;
          const isPrimary = idx === 0;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                isPrimary
                  ? 'bg-emerald-50/40 border-emerald-300/80 shadow-2xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Photo Thumbnail with Preview on Click */}
              <div
                onClick={() => setPreviewModalUrl(imgUrl)}
                className="relative group w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer shadow-2xs"
                title="Click to view full preview"
              >
                <img
                  src={imgUrl}
                  alt={`Tour Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="w-4 h-4" />
                </div>
                {isPrimary && (
                  <span className="absolute bottom-0 inset-x-0 bg-[#173F35]/90 text-white text-[9px] font-bold text-center py-0.5 tracking-wider uppercase">
                    Cover
                  </span>
                )}
              </div>

              {/* Photo Details & Direct Input */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-stone-800">
                      Photo #{idx + 1}
                    </span>
                    {isUploaded ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        <span>Uploaded File ({sizeEstimate})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        <LinkIcon className="w-3 h-3" />
                        <span>Web Link</span>
                      </span>
                    )}
                  </div>

                  {/* Move Up / Move Down */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400"
                      title="Move photo up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400"
                      title="Move photo down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Input or Data URL indicator */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={isUploaded ? `[Uploaded Image: ${sizeEstimate}]` : imgUrl}
                    onChange={(e) => !isUploaded && handleUrlChange(idx, e.target.value)}
                    readOnly={isUploaded}
                    placeholder="https://images.unsplash.com/..."
                    className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg border font-mono truncate ${
                      isUploaded
                        ? 'bg-stone-50 border-stone-200 text-stone-600 cursor-default'
                        : 'bg-white border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#173F35]'
                    }`}
                  />

                  {/* Replace with uploaded file button */}
                  <button
                    type="button"
                    onClick={() => {
                      setReplaceTargetIndex(idx);
                      if (singleReplaceInputRef.current) {
                        singleReplaceInputRef.current.click();
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 shrink-0 cursor-pointer"
                    title="Upload a new photo file to replace this slot"
                  >
                    <UploadCloud className="w-3 h-3 text-[#E99B54]" />
                    <span className="hidden sm:inline">Replace</span>
                  </button>

                  {/* Make Primary Cover button */}
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleMakeCover(idx)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border border-[#173F35]/20 bg-white hover:bg-emerald-50 text-[#173F35] shrink-0 cursor-pointer"
                      title="Set as hero cover image"
                    >
                      <Sparkles className="w-3 h-3 text-[#E99B54]" />
                      <span className="hidden sm:inline">Make Cover</span>
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 shrink-0 transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {images.length === 0 && (
          <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-2xl text-stone-400 text-xs space-y-2">
            <ImageIcon className="w-8 h-8 mx-auto text-stone-300" />
            <p>No photos added yet. Upload files from your computer/device or paste image links above.</p>
          </div>
        )}
      </div>

      {/* Lightbox / Preview Modal */}
      {previewModalUrl && (
        <div
          onClick={() => setPreviewModalUrl(null)}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl max-h-[90vh] bg-stone-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative flex flex-col"
          >
            <div className="flex items-center justify-between p-3 bg-black/50 text-white text-xs">
              <span className="font-medium">Photo Full Preview</span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/40 overflow-hidden max-h-[80vh]">
              <img
                src={previewModalUrl}
                alt="Enlarged Preview"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
