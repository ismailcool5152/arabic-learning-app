import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, Upload, Sparkles, BookOpen, Search, ArrowRight, Loader2, Volume2 } from 'lucide-react';
import { LayoutTheme } from '../types';
import { AudioPlayButton } from './AudioPlayButton';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: LayoutTheme;
  onSelectRoot: (root: string) => void;
  customApiKey?: string;
}

export default function CameraScanner({ isOpen, onClose, theme, onSelectRoot, customApiKey }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // OCR Scan Results state
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    extractedWord?: string;
    root?: string;
    rootMeaning?: string;
    translit?: string;
    wordMeaning?: string;
    exampleVerse?: string;
    exampleArabic?: string;
    exampleEnglish?: string;
    error?: string;
  } | null>(null);

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Card & Text Styles
  const bgClass = isParchment 
    ? 'bg-[#faf6ed] border-[#ebdcc3] text-[#2c241e]' 
    : isCosmic 
      ? 'bg-slate-950 border-indigo-950 text-indigo-50 shadow-indigo-950/20' 
      : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl';

  const headingClass = isParchment ? 'text-[#5c3d2e]' : 'text-slate-100';
  const textMutedClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';
  const accentTextClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';
  const primaryBtnClass = isParchment
    ? 'bg-[#8c6239] hover:bg-[#a67c52] text-[#faf6ed]'
    : isCosmic
      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40';

  const secondaryBtnClass = isParchment
    ? 'bg-[#f4efe8] hover:bg-[#ebdcc3] text-[#8c6239] border border-[#d8c8b8]'
    : isCosmic
      ? 'bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-900/40'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700';

  // Toggle Camera
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(false);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera access failed, falling back to manual upload:", err);
      setCameraError("Camera access could not be initialized. You can still snap a picture with your phone's camera by uploading an image below.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw centered region to canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        stopCamera();
        processImageOCR(dataUrl);
      }
    }
  };

  const processImageOCR = async (base64Image: string) => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const response = await fetch('/api/ocr-root', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image,
          customApiKey
        })
      });
      
      const data = await response.json();
      setScanResult(data);
    } catch (err: any) {
      console.warn("OCR analysis connection unavailable:", err);
      setScanResult({
        success: false,
        error: "Server connection failed. Please ensure your backend is running and internet is connected."
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Drag and Drop files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setCapturedImage(event.target.result);
        stopCamera();
        processImageOCR(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setScanResult(null);
    startCamera();
  };

  const handleExplore = () => {
    if (scanResult && scanResult.success && scanResult.root) {
      onSelectRoot(scanResult.root);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-3xl border overflow-hidden flex flex-col max-h-[90vh] ${bgClass}`}>
        
        {/* Header bar */}
        <div className={`p-5 flex items-center justify-between border-b ${isParchment ? 'border-[#ebdcc3] bg-[#fbf9f5]' : isCosmic ? 'border-indigo-950/80 bg-slate-950' : 'border-slate-800 bg-slate-900'}`}>
          <div className="flex items-center gap-2.5">
            <Camera className={`w-5 h-5 ${accentTextClass}`} />
            <h2 className="text-lg font-bold font-serif">Arabic Word Lens (Camera Scan)</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full hover:bg-black/10 transition-all cursor-pointer ${textMutedClass}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Area/Video Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!capturedImage ? (
            <div className="space-y-4">
              <p className="text-sm">
                Point your camera to any printed or digital Arabic word (such as in a Quran copy, book, or screen) to extract the word and analyze its root instantly!
              </p>

              {/* Viewfinder block */}
              {cameraActive ? (
                <div className="relative aspect-video w-full max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/50 bg-black">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Custom Scanner viewfinder guides */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl"></div>
                      <div className="w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr"></div>
                    </div>
                    
                    {/* Centered Scan Target Box */}
                    <div className="self-center flex flex-col items-center gap-1 bg-black/40 backdrop-blur-xs px-4 py-2 rounded-lg border border-amber-500/20">
                      <div className="w-48 h-12 border-2 border-dashed border-amber-400 rounded flex items-center justify-center">
                        <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase">Center Word Here</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl"></div>
                      <div className="w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br"></div>
                    </div>
                  </div>

                  {/* Capture Button */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <button
                      onClick={handleCapture}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" /> Scan Word
                    </button>
                  </div>
                </div>
              ) : (
                /* Fallback Drag & Drop or manual file trigger */
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`w-full max-w-md mx-auto aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all ${
                    dragActive 
                      ? 'border-amber-500 bg-amber-500/5' 
                      : (isParchment ? 'border-[#ebdcc3] bg-[#fcfbf9]/50 hover:bg-[#ebdcc3]/10' : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/30')
                  }`}
                >
                  <Upload className={`w-8 h-8 mb-3 opacity-60 ${accentTextClass}`} />
                  <p className="text-sm font-semibold mb-1">Drag and drop your word photo here</p>
                  <p className="text-xs opacity-60 mb-4">Supports PNG, JPG, JPEG</p>
                  
                  <label className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${primaryBtnClass}`}>
                    Choose File / Use Phone Camera
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" // Forces back camera directly in native iOS/Android file input!
                      onChange={handleFileInput}
                      className="hidden" 
                    />
                  </label>
                  
                  {cameraError && (
                    <p className="text-[10px] text-amber-600 font-medium max-w-[280px] mt-4">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Results & Scanning States */
            <div className="space-y-6">
              {/* Captured Image Preview Thumbnail */}
              <div className="relative w-full max-w-xs mx-auto aspect-video rounded-xl overflow-hidden border border-black/10 bg-black flex items-center justify-center">
                <img src={capturedImage} alt="Captured word target" className="max-h-full max-w-full object-contain" />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer"
                  title="Rescan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Loader with rotating Quranic-specific status prompts */}
              {isScanning && (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                    <Sparkles className="w-4 h-4 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold font-serif uppercase tracking-widest">Analyzing Image Lens...</h3>
                    <p className="text-xs opacity-60 max-w-xs">Reading Arabic lettering, isolating the word and parsing morphology...</p>
                  </div>
                </div>
              )}

              {/* Scanned Analysis Display */}
              {scanResult && (
                <div className="space-y-5 animate-fadeIn">
                  {scanResult.success ? (
                    <div className={`p-6 rounded-2xl border space-y-5 ${isParchment ? 'bg-[#f4efe8]/60 border-[#ebdcc3]' : 'bg-white/[0.02] border-white/5'}`}>
                      {/* Identified Header */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4 border-b border-dashed pb-4 opacity-95">
                        <div className="text-center sm:text-left space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block">Scanned Word</span>
                          <span className={`text-4xl font-arabic font-bold ${isParchment ? 'text-[#2c241e]' : 'text-amber-400'}`} dir="rtl">
                            {scanResult.extractedWord}
                          </span>
                          <span className="text-xs font-mono block opacity-75 italic">
                            "{scanResult.translit}" &mdash; {scanResult.wordMeaning}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 text-center shrink-0">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Extracted Root</span>
                          <span className="text-xl font-arabic font-bold text-amber-500 mt-0.5" dir="rtl">
                            {scanResult.root}
                          </span>
                          <span className="text-[10px] font-mono font-semibold opacity-80 mt-0.5">
                            {scanResult.rootMeaning}
                          </span>
                        </div>
                      </div>

                      {/* Quran Example section */}
                      {scanResult.exampleVerse && (
                        <div className={`p-4 rounded-xl space-y-2 border ${isParchment ? 'bg-white/50 border-[#ebdcc3]' : 'bg-black/20 border-white/5'}`}>
                          <div className="flex items-center gap-1.5 opacity-60 text-xs font-bold uppercase tracking-widest">
                            <BookOpen className="w-3.5 h-3.5" /> Example in Quran (Verse {scanResult.exampleVerse})
                          </div>
                          <p className="font-arabic text-right text-lg font-bold leading-relaxed pt-1" dir="rtl">
                            {scanResult.exampleArabic}
                          </p>
                          <p className="text-xs italic font-serif opacity-80">
                            "{scanResult.exampleEnglish}"
                          </p>
                        </div>
                      )}

                      {/* Action trigger button */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={handleExplore}
                          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${primaryBtnClass}`}
                        >
                          <Search className="w-4 h-4" /> Analyze in Root Explorer <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleReset}
                          className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${secondaryBtnClass}`}
                        >
                          <RotateCcw className="w-4 h-4" /> Scan Another Word
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Scan Failure */
                    <div className="p-6 rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 text-center space-y-3 max-w-md mx-auto">
                      <p className="text-sm font-semibold text-red-500">Scan Unsuccessful</p>
                      <p className="text-xs opacity-80">
                        {scanResult.error || "No readable Arabic text could be identified. Please hold the camera close and focus clearly."}
                      </p>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden Canvas used for video frames capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
