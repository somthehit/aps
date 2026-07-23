"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Loader2, Calendar } from "lucide-react";

interface CalendarEntry {
  id: number;
  month_name: string;
  month_index: number;
  days: any[];
  academic_year: string;
  updated_at: string;
}

const NEPALI_MONTHS = [
  { name: "Baishakh (बैशाख)", index: 1 },
  { name: "Jestha (जेठ)", index: 2 },
  { name: "Asar (असार)", index: 3 },
  { name: "Shrawan (साउन)", index: 4 },
  { name: "Bhadau (भदौ)", index: 5 },
  { name: "Ashoj (असोज)", index: 6 },
  { name: "Kartik (कात्तिक)", index: 7 },
  { name: "Mangsir (मंसिर)", index: 8 },
  { name: "Paush (पुष)", index: 9 },
  { name: "Magh (माघ)", index: 10 },
  { name: "Falgun (फागुन)", index: 11 },
  { name: "Chaitra (चैत)", index: 12 },
];

const ACADEMIC_YEARS = ["२०८०", "२०८१", "२०८२", "२०८३", "२०८४", "२०८५"];

export default function CalendarDataManager() {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [academicYear, setAcademicYear] = useState("२०८३");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDays, setEditDays] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMonthIndex, setNewMonthIndex] = useState<number>(1);

  const fetchData = async (year?: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/calendar-data");
      if (res.ok) {
        const json = await res.json();
        let data = json.data || [];
        if (year) {
          data = data.filter((e: CalendarEntry) => e.academic_year === year);
        }
        setEntries(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(academicYear);
  }, [academicYear]);

  const handleAddMonth = async () => {
    if (!newMonthIndex) return;
    const month = NEPALI_MONTHS.find((m) => m.index === newMonthIndex);
    if (!month) return;

    try {
      setSaving(true);
      const res = await fetch("/api/calendar-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month_name: month.name,
          month_index: month.index,
          academic_year: academicYear,
          days: [],
        }),
      });
      if (res.ok) {
        fetchData(academicYear);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (entry: CalendarEntry) => {
    setEditingId(entry.id);
    setEditDays(JSON.stringify(entry.days, null, 2));
    setSelectedMonth(entry.month_name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDays("");
    setSelectedMonth("");
  };

  const handleSaveDays = async (id: number) => {
    try {
      setSaving(true);
      let parsed: any[];
      try {
        parsed = JSON.parse(editDays);
        if (!Array.isArray(parsed)) throw new Error("Must be an array");
      } catch {
        alert("Invalid JSON format. Must be a valid JSON array.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/calendar-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, days: parsed }),
      });
      if (res.ok) {
        fetchData(academicYear);
        cancelEdit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this calendar month entry?")) return;
    try {
      const res = await fetch(`/api/calendar-data?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries(entries.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const availableMonths = NEPALI_MONTHS.filter(
    (m) => !entries.some((e) => e.month_index === m.index)
  );

  return (
    <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 md:p-8 shadow-sm text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1a3a2a]/10 pb-4 mb-6">
        <h3 className="font-serif font-bold text-lg text-[#1a3a2a] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#c9a227]" />
          <span>Calendar Wall Chart Management</span>
        </h3>
        <div className="flex items-center gap-3">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="p-2 border border-[#c9a227]/30 bg-white rounded text-xs font-bold text-[#1a3a2a]"
          >
            {ACADEMIC_YEARS.map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a3a2a] text-white border border-[#c9a227] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#102419] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#c9a227]" />
            <span>Add Month</span>
          </button>
          <button
            onClick={() => fetchData(academicYear)}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-200 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-[#c9a227]/30 rounded-lg bg-[#fdf6e3]/20 flex items-center gap-4">
          <label className="text-xs font-bold text-[#1a3a2a] whitespace-nowrap">Select Month:</label>
          <select
            value={newMonthIndex}
            onChange={(e) => setNewMonthIndex(parseInt(e.target.value))}
            className="flex-1 p-2 border border-[#c9a227]/30 bg-white rounded text-xs font-bold"
          >
            {availableMonths.length === 0 ? (
              <option value="" disabled>All months added</option>
            ) : (
              availableMonths.map((m) => (
                <option key={m.index} value={m.index}>{m.name}</option>
              ))
            )}
          </select>
          <button
            onClick={handleAddMonth}
            disabled={saving || availableMonths.length === 0}
            className="px-4 py-2 bg-[#1a3a2a] text-white border border-[#c9a227] rounded text-xs font-bold uppercase hover:bg-[#102419] cursor-pointer disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add"}
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400 font-sans text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading calendar data...
        </div>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center text-slate-400 font-sans text-sm">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No calendar data for year {academicYear}. Click "Add Month" to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border border-[#c9a227]/20 rounded-lg overflow-hidden"
            >
              <div className="bg-[#1a3a2a]/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#1a3a2a] text-[#c9a227] flex items-center justify-center font-bold text-xs">
                    {String(entry.month_index).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-[#1a3a2a]">{entry.month_name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {entry.days?.length || 0} days · updated {new Date(entry.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === entry.id ? (
                    <>
                      <button
                        onClick={() => handleSaveDays(entry.id)}
                        disabled={saving}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#1a3a2a] text-white border border-[#c9a227] rounded text-xs font-bold hover:bg-[#102419] cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5 text-[#c9a227]" />
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(entry)}
                        className="p-1.5 text-[#1a3a2a] hover:bg-[#1a3a2a]/10 rounded cursor-pointer"
                        title="Edit days"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 text-[#8b1a1a] hover:bg-[#8b1a1a]/10 rounded cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === entry.id ? (
                <div className="p-4 bg-[#fdf6e3]/10">
                  <label className="text-xs font-bold text-slate-500 block mb-2">
                    Days JSON Array (edit each day object):
                  </label>
                  <textarea
                    value={editDays}
                    onChange={(e) => setEditDays(e.target.value)}
                    rows={10}
                    className="w-full p-3 border border-[#c9a227]/30 bg-white rounded font-mono text-xs focus:outline-none focus:border-[#1a3a2a]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Each day should be an object, e.g. {"{"}"day": 1, "event": "Event name"{"}"}
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  {entry.days && entry.days.length > 0 ? (
                    <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-1.5">
                      {entry.days.map((day: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-1.5 border border-[#c9a227]/10 rounded text-center text-[10px] bg-white hover:bg-[#fdf6e3]/30"
                        >
                          <div className="font-bold text-[#1a3a2a]">{day.day || day.date || idx + 1}</div>
                          {day.event && (
                            <div className="text-[8px] text-[#8b1a1a] truncate leading-tight mt-0.5">
                              {day.event}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400">
                      No days configured. Click the edit icon to add days.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
