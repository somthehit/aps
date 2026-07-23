"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Trash2, Save, Image as ImageIcon, Calendar, Split, Layers, Upload } from "lucide-react";

const SINGLE_MONTHS = [
  { id: "baishakh",  name: "Baishakh (बैशाख)" },
  { id: "jestha",    name: "Jestha (जेठ)" },
  { id: "asar",      name: "Asar (असार)" },
  { id: "shrawan",   name: "Shrawan (साउन)" },
  { id: "bhadau",    name: "Bhadau (भदौ)" },
  { id: "ashoj",     name: "Ashoj (असोज)" },
  { id: "kartik",    name: "Kartik (कात्तिक)" },
  { id: "mangsir",   name: "Mangsir (मंसिर)" },
  { id: "paush",     name: "Paush (पुष)" },
  { id: "magh",      name: "Magh (माघ)" },
  { id: "falgun",    name: "Falgun (फागुन)" },
  { id: "chaitra",   name: "Chaitra (चैत)" },
];

const MONTH_PAIRS = [
  { id: "baishakh-jestha",    label: "Baishakh (बैशाख) + Jestha (जेठ)" },
  { id: "asar-shrawan",       label: "Asar (असार) + Shrawan (साउन)" },
  { id: "bhadau-ashoj",       label: "Bhadau (भदौ) + Ashoj (असोज)" },
  { id: "kartik-mangsir",     label: "Kartik (कात्तिक) + Mangsir (मंसिर)" },
  { id: "paush-magh",         label: "Paush (पुष) + Magh (माघ)" },
  { id: "falgun-chaitra",     label: "Falgun (फागुन) + Chaitra (चैत)" },
];

interface MonthData {
  left: string[];
  right: string[];
}

interface CalendarImagesState {
  [key: string]: MonthData;
}

const EMPTY: MonthData = { left: [], right: [] };

type Mode = "single" | "pair";

export default function CalendarImageManager() {
  const [mode, setMode] = useState<Mode>("single");
  const [selectedId, setSelectedId] = useState<string>(SINGLE_MONTHS[0].id);
  const [calendarData, setCalendarData] = useState<CalendarImagesState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const json = await res.json();
        const raw = json.data?.calendar_dynamic_config;
        if (raw) {
          setCalendarData(JSON.parse(raw));
        } else {
          const initial: CalendarImagesState = {};
          SINGLE_MONTHS.forEach((m) => { initial[m.id] = { left: [], right: [] }; });
          MONTH_PAIRS.forEach((p) => { initial[p.id] = { left: [], right: [] }; });
          setCalendarData(initial);
        }
      }
    } catch (e) {
      console.error("Failed to load calendar configuration:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = JSON.stringify(calendarData);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendar_dynamic_config: payload,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        alert("Calendar configuration saved successfully!");
      } else {
        alert("Save failed: " + (json.error || "Unknown error"));
      }
    } catch (error: any) {
      console.error(error);
      alert("Error saving settings: " + (error?.message || error));
    } finally {
      setSaving(false);
    }
  };

  const items = mode === "single" ? SINGLE_MONTHS : MONTH_PAIRS;
  const labelKey = mode === "single" ? "name" : "label";

  // When switching mode, reset selection to first item
  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setSelectedId(newMode === "single" ? SINGLE_MONTHS[0].id : MONTH_PAIRS[0].id);
  };

  const currentData: MonthData = calendarData[selectedId] || EMPTY;

  const updateSideImages = (side: "left" | "right", newImages: string[]) => {
    setCalendarData((prev) => ({
      ...prev,
      [selectedId]: {
        ...(prev[selectedId] || EMPTY),
        [side]: newImages,
      },
    }));
  };

  const removeImage = (side: "left" | "right", index: number) => {
    if (!confirm("Remove this image?")) return;
    const updated = currentData[side].filter((_, i) => i !== index);
    updateSideImages(side, updated);
  };

  const renderImagePanel = (title: string, side: "left" | "right") => {
    const list = currentData[side];
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-[#c9a227]/20 flex-1">
        <h3 className="text-base font-bold text-[#1a3a2a] mb-4 flex items-center gap-2 font-serif">
          <ImageIcon className="w-4 h-4 text-[#c9a227]" />
          {title}
          <span className="ml-auto text-xs font-sans font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {list.length} image{list.length !== 1 ? "s" : ""}
          </span>
        </h3>

        <div className="space-y-3 mb-5 max-h-[360px] overflow-y-auto pr-1">
          {list.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              No images set for this {side} panel.
            </p>
          ) : (
            list.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-[#fdf6e3]/30 p-2 rounded-lg border border-[#c9a227]/20"
              >
                <img
                  src={url}
                  alt={`Calendar page`}
                  className="w-14 h-20 object-cover rounded shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 truncate font-mono">{url}</p>
                  <p className="text-xs font-semibold text-[#1a3a2a] mt-1">Page {index + 1}</p>
                </div>
                <button
                  onClick={() => removeImage(side, index)}
                  className="p-1.5 text-[#8b1a1a] hover:bg-[#8b1a1a]/10 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[#c9a227]/20 pt-4">
          <p className="text-xs font-semibold text-[#1a3a2a] mb-2">Add Image</p>
          <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1a3a2a] text-white border border-[#c9a227] rounded-lg text-xs font-bold uppercase cursor-pointer hover:bg-[#102419] transition-all">
            <Upload className="w-4 h-4 text-[#c9a227]" />
            <span>Choose File & Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const input = e.currentTarget;
                input.value = "";
                const form = new FormData();
                form.append("file", file);
                form.append("folder", `calendar/${selectedId}`);
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: form,
                });
                if (res.ok) {
                  const json = await res.json();
                  if (json.url) {
                    setCalendarData((prev) => {
                      const entry = prev[selectedId] || EMPTY;
                      return {
                        ...prev,
                        [selectedId]: {
                          ...entry,
                          [side]: [...(entry[side] || []), json.url],
                        },
                      };
                    });
                  }
                } else {
                  const err = await res.text();
                  alert("Upload failed: " + err);
                }
              }}
            />
          </label>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3a2a]" />
        <span className="ml-3 text-sm text-slate-500 font-sans">Loading calendar configuration…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#1a3a2a]">School Calendar Pages</h2>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Configure calendar wall chart images — choose single months or combined month pairs.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a3a2a] text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#102419] transition-all flex items-center gap-2 border border-[#c9a227] shadow-sm disabled:opacity-70 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#c9a227]" />}
          {saving ? "Saving…" : "Save Configuration"}
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="bg-[#1a3a2a]/5 p-4 rounded-xl border border-[#c9a227]/20 flex flex-wrap items-center gap-4">
        <div className="flex bg-white rounded-lg border border-[#c9a227]/30 p-0.5">
          <button
            onClick={() => switchMode("single")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === "single"
                ? "bg-[#1a3a2a] text-[#c9a227] shadow-sm"
                : "text-slate-500 hover:text-[#1a3a2a]"
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            Single Month
          </button>
          <button
            onClick={() => switchMode("pair")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === "pair"
                ? "bg-[#1a3a2a] text-[#c9a227] shadow-sm"
                : "text-slate-500 hover:text-[#1a3a2a]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Month Pair
          </button>
        </div>

        <span className="text-xs font-bold text-[#1a3a2a] flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-[#c9a227]" />
          {mode === "single" ? "Single Month:" : "Month Pair:"}
        </span>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="bg-white border border-[#c9a227]/40 rounded-lg px-3 py-2 text-sm text-[#1a3a2a] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a3a2a] cursor-pointer"
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {(item as any)[labelKey]}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-1.5 ml-auto">
          {items.map((item) => {
            const data = calendarData[item.id] || EMPTY;
            const hasImages = data.left.length > 0 || data.right.length > 0;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                title={(item as any)[labelKey]}
                className={`w-6 h-6 rounded-full border-2 text-[9px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                  selectedId === item.id
                    ? "border-[#1a3a2a] bg-[#1a3a2a] text-[#c9a227]"
                    : hasImages
                    ? "border-[#c9a227] bg-[#c9a227]/20 text-[#1a3a2a]"
                    : "border-gray-300 bg-white text-gray-300"
                }`}
              >
                {item.id.charAt(0).toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-xs font-sans text-slate-500 -mt-2">
        Configuring: <span className="font-bold text-[#1a3a2a]">{(items.find(i => i.id === selectedId) as any)?.[labelKey]}</span>
        {" · "}Left: {currentData.left.length} images · Right: {currentData.right.length} images
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {renderImagePanel("Left Panel", "left")}
        {renderImagePanel("Right Panel", "right")}
      </div>
    </div>
  );
}
