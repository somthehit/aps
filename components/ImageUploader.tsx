"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, Crop, ZoomIn, ZoomOut, Check, AlertCircle } from "lucide-react";

interface CropArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ResolutionConstraint {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  aspectRatio?: number; // width/height, 0 for free
}

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  folder?: string;
  label?: string;
  constraints?: ResolutionConstraint;
  className?: string;
  skipCrop?: boolean;
  compact?: boolean;
}

export default function ImageUploader({
  onUpload,
  folder = "general",
  label = "Upload Image",
  constraints,
  className = "",
  skipCrop = false,
  compact = false,
}: ImageUploaderProps) {
  const [phase, setPhase] = useState<"idle" | "crop" | "uploading">("idle");
  const [src, setSrc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, w: 200, h: 200 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [validationError, setValidationError] = useState("");
  const [zoom, setZoom] = useState(1);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origCrop: CropArea; resizing: boolean; edge: string } | null>(null);

  const displayW = imgSize.w * zoom;
  const displayH = imgSize.h * zoom;
  const offsetX = (displayW - (containerRef.current?.clientWidth || displayW)) / 2;
  const offsetY = (displayH - (containerRef.current?.clientHeight || displayH)) / 2;

  const validateResolution = useCallback((w: number, h: number): string => {
    if (!constraints) return "";
    if (constraints.minW && w < constraints.minW) return `Width too small (min: ${constraints.minW}px, got: ${w}px)`;
    if (constraints.minH && h < constraints.minH) return `Height too small (min: ${constraints.minH}px, got: ${h}px)`;
    if (constraints.maxW && w > constraints.maxW) return `Width too large (max: ${constraints.maxW}px, got: ${w}px)`;
    if (constraints.maxH && h > constraints.maxH) return `Height too large (max: ${constraints.maxH}px, got: ${h}px)`;
    if (constraints.aspectRatio && constraints.aspectRatio > 0) {
      const ratio = w / h;
      if (Math.abs(ratio - constraints.aspectRatio) > 0.05) {
        return `Aspect ratio mismatch (expected: ${constraints.aspectRatio.toFixed(2)}, got: ${ratio.toFixed(2)})`;
      }
    }
    return "";
  }, [constraints]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setValidationError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const err = validateResolution(w, h);
        if (err) {
          setValidationError(err);
          return;
        }
        setSrc(ev.target?.result as string);
        setFile(f);
        setImgSize({ w, h });

        if (skipCrop) {
          uploadDirect(f);
          return;
        }

        // initial crop: centered 80%
        const cw = Math.round(w * 0.8);
        const ch = Math.round(h * 0.8);
        setCrop({ x: Math.round((w - cw) / 2), y: Math.round((h - ch) / 2), w: cw, h: ch });
        setPhase("crop");
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleCropConfirm = async () => {
    if (!file || !src) return;
    setPhase("uploading");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = crop.w;
      canvas.height = crop.h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(imgRef.current!, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);

      const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), file.type));
      const croppedFile = new File([blob], file.name, { type: file.type });

      const fd = new FormData();
      fd.append("file", croppedFile);
      fd.append("folder", folder);

      const resp = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await resp.json();
      if (!json.success) throw new Error(json.error || "Upload failed");

      onUpload(json.url);
      setPhase("idle");
      setSrc("");
      setFile(null);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
      setPhase("crop");
    }
  };

  const uploadDirect = async (fileToUpload: File) => {
    setPhase("uploading");
    try {
      const fd = new FormData();
      fd.append("file", fileToUpload);
      fd.append("folder", folder);

      const resp = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await resp.json();
      if (!json.success) throw new Error(json.error || "Upload failed");

      onUpload(json.url);
      setPhase("idle");
      setSrc("");
      setFile(null);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
      setPhase("idle");
    }
  };

  // mouse drag handlers for crop area
  const handleMouseDown = (e: React.MouseEvent, edge: string) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const scaleX = imgSize.w / displayW;
    const scaleY = imgSize.h / displayH;
    const startX = (e.clientX - rect.left) * scaleX;
    const startY = (e.clientY - rect.top) * scaleY;
    dragRef.current = { startX, startY, origCrop: { ...crop }, resizing: edge !== "move", edge };

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const { startX: sx, startY: sy, origCrop: oc, resizing, edge: ed } = dragRef.current;
      const r = containerRef.current!.getBoundingClientRect();
      const dx = ((ev.clientX - r.left) * scaleX) - sx;
      const dy = ((ev.clientY - r.top) * scaleY) - sy;

      if (!resizing) {
        // move
        let nx = oc.x + dx;
        let ny = oc.y + dy;
        nx = Math.max(0, Math.min(nx, imgSize.w - oc.w));
        ny = Math.max(0, Math.min(ny, imgSize.h - oc.h));
        setCrop({ ...oc, x: nx, y: ny });
      } else {
        let { x, y, w, h } = oc;
        if (ed.includes("l")) { x += dx; w -= dx; }
        if (ed.includes("r")) w += dx;
        if (ed.includes("t")) { y += dy; h -= dy; }
        if (ed.includes("b")) h += dy;
        // clamp
        if (w < 20) w = 20;
        if (h < 20) h = 20;
        if (x < 0) { w += x; x = 0; }
        if (y < 0) { h += y; y = 0; }
        if (x + w > imgSize.w) w = imgSize.w - x;
        if (y + h > imgSize.h) h = imgSize.h - y;
        setCrop({ x, y, w: Math.round(w), h: Math.round(h) });
      }
    };
    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  if (phase === "idle") {
    return (
      <div className={`relative ${className}`}>
        <label className={`flex flex-col items-center justify-center w-full ${compact ? 'min-h-[80px] py-3' : 'min-h-[120px] px-4 py-6'} border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-teal-400 cursor-pointer transition-all`}>
          <Upload className={`${compact ? 'w-5 h-5 mb-1' : 'w-8 h-8 mb-2'} text-slate-400`} />
          <span className={`${compact ? 'text-sm' : 'text-sm'} font-medium text-slate-600`}>{label}</span>
          <span className="text-xs text-slate-400 mt-1">Click to browse {skipCrop ? '' : '(supports crop)'}</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
        </label>
        {validationError && (
          <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">{validationError}</p>
          </div>
        )}
      </div>
    );
  }

  if (phase === "crop") {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Crop className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-slate-800">Crop Image</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {crop.w} × {crop.h}px
              </span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button onClick={() => setPhase("idle")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-slate-900/5 flex items-center justify-center" style={{ minHeight: "400px" }}>
            <div ref={containerRef} className="relative overflow-hidden rounded-lg bg-checkered"
              style={{ width: "100%", maxWidth: `${displayW}px`, height: `${displayH}px`, maxHeight: "60vh" }}>
              <img
                ref={imgRef}
                src={src}
                alt="Crop preview"
                className="block select-none"
                style={{ width: `${displayW}px`, height: `${displayH}px`, maxWidth: "none", maxHeight: "none", objectFit: "contain" }}
                draggable={false}
              />
              {/* overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.4)" }}>
                <div
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${(crop.x / imgSize.w) * 100}%`,
                    top: `${(crop.y / imgSize.h) * 100}%`,
                    width: `${(crop.w / imgSize.w) * 100}%`,
                    height: `${(crop.h / imgSize.h) * 100}%`,
                    background: "transparent",
                    boxShadow: "0 0 0 5000px rgba(0,0,0,0.4)",
                    cursor: "move",
                    border: "2px solid #0d9488",
                    borderRadius: "4px",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "move")}
                >
                  {/* resize handles */}
                  {["nw", "n", "ne", "w", "e", "sw", "s", "se"].map((dir) => (
                    <div key={dir}
                      className="absolute w-3 h-3 bg-teal-600 border-2 border-white rounded-sm"
                      style={{
                        [dir.includes("n") ? "top" : "bottom"]: "-5.5px",
                        [dir.includes("l") || dir.includes("w") ? "left" : dir.includes("e") ? "right" : "left"]: dir.includes("w") ? "-5.5px" : dir.includes("e") ? "-5.5px" : "calc(50% - 5.5px)",
                        cursor: `${dir}-resize`,
                      }}
                      onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, dir); }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Drag to adjust crop area. Drag corners/edges to resize.</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setPhase("idle"); setSrc(""); setFile(null); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleCropConfirm}
                className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                <Check className="w-4 h-4" />
                Apply Crop & Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center w-full min-h-[120px] px-4 py-6 border-2 border-dashed border-teal-300 rounded-xl bg-teal-50 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-teal-700">Uploading cropped image...</span>
      </div>
    </div>
  );
}
