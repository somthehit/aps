"use client";
import { useState, useRef, useEffect } from "react";

// Nepali month IDs in calendar order (Baishakh = month 1)
const NEPALI_MONTH_IDS = [
  "baishakh", "jestha",  "asar",    "shrawan",
  "bhadau",   "ashoj",   "kartik",  "mangsir",
  "paush",    "magh",    "falgun",  "chaitra",
];

/**
 * Rough Nepali month detection based on English (Gregorian) date.
 * Nepali calendar shifts by roughly 56.7 years and months begin mid-April.
 * This is an approximation sufficient for selecting calendar images.
 */
function getCurrentNepaliMonthId(): string {
  const now = new Date();
  const month = now.getMonth(); // 0=Jan
  const day = now.getDate();

  // Approximate mapping: Nepali month 1 (Baishakh) starts ~April 14
  // Gregorian month → Nepali month start (approx day of month)
  const TRANSITIONS: [number, number][] = [
    [3, 14],  // April 14 → Baishakh (month index 0)
    [4, 15],  // May 15   → Jestha
    [5, 15],  // June 15  → Asar
    [6, 16],  // July 16  → Shrawan
    [7, 17],  // Aug 17   → Bhadau
    [8, 17],  // Sep 17   → Ashoj
    [9, 18],  // Oct 18   → Kartik
    [10,17],  // Nov 17   → Mangsir
    [11,16],  // Dec 16   → Paush
    [0, 15],  // Jan 15   → Magh
    [1, 13],  // Feb 13   → Falgun
    [2, 14],  // Mar 14   → Chaitra
  ];

  let nepaliMonthIndex = 11; // default Chaitra
  for (let i = 0; i < TRANSITIONS.length; i++) {
    const [gMonth, startDay] = TRANSITIONS[i];
    if (month === gMonth && day >= startDay) {
      nepaliMonthIndex = i;
      break;
    }
    if (month === gMonth && day < startDay) {
      nepaliMonthIndex = (i - 1 + 12) % 12;
      break;
    }
  }
  return NEPALI_MONTH_IDS[nepaliMonthIndex];
}

interface MonthData {
  left: string[];
  right: string[];
}

// Hardcoded fallback images (original static images)
const FALLBACK_LEFT: string[] = [];
const FALLBACK_RIGHT: string[] = [];

export default function CalendarWidget() {
  const [show, setShow] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [leftImages, setLeftImages] = useState<string[]>(FALLBACK_LEFT);
  const [rightImages, setRightImages] = useState<string[]>(FALLBACK_RIGHT);

  useEffect(() => {
    if (show && iframeRef.current) {
      iframeRef.current.setAttribute("allowtransparency", "true");
    }
  }, [show]);

  // Fetch dynamic calendar config on mount
  useEffect(() => {
    const fetchCalendarConfig = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) return;
        const json = await res.json();
        const raw = json.data?.calendar_dynamic_config;
        if (!raw) return;

        const config: Record<string, MonthData> = JSON.parse(raw);
        const currentMonthId = getCurrentNepaliMonthId();
        const monthData = config[currentMonthId];

        if (monthData) {
          if (monthData.left && monthData.left.length > 0) {
            setLeftImages(monthData.left);
          }
          if (monthData.right && monthData.right.length > 0) {
            setRightImages(monthData.right);
          }
        }
      } catch (e) {
        // Silently fall back to hardcoded images
        console.warn("Calendar config fetch failed, using defaults:", e);
      }
    };
    fetchCalendarConfig();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={() => setShow(!show)}
        className="px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90 cursor-pointer shadow-sm"
        style={{ background: "#1a3a2a", color: "#c9a227", border: "1px solid #c9a227" }}
      >
        {show ? "Hide Nepali Calendar" : "📅 Nepali Calendar"}
      </button>

      {show && (
        <div className="mt-8 flex flex-col xl:flex-row gap-6 items-center xl:items-start justify-center w-full max-w-7xl px-4">
          {/* Left Side Images (Desktop) */}
          <div className="hidden xl:flex flex-col gap-4 overflow-y-auto h-[333px] w-full max-w-[400px] pr-2">
            {leftImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="School Calendar"
                className="w-full h-auto rounded-lg shadow-sm object-contain"
              />
            ))}
          </div>

          {/* Center Calendar */}
          <div className="shrink-0 shadow-lg rounded-lg overflow-hidden bg-white">
            <iframe
              ref={iframeRef}
              src="https://www.ashesh.com.np/calendar-widget/calendar.php?tithi=1&header_color=default&api=872156q120"
              frameBorder="0"
              scrolling="no"
              marginWidth={0}
              marginHeight={0}
              style={{ border: "none", overflow: "hidden", width: 370, height: 333 }}
            />
          </div>

          {/* Right Side Images (Desktop) */}
          <div className="hidden xl:flex flex-col gap-4 overflow-y-auto h-[333px] w-full max-w-[400px] pl-2">
            {rightImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="School Calendar"
                className="w-full h-auto rounded-lg shadow-sm object-contain"
              />
            ))}
          </div>

          {/* Mobile/Tablet view – all images below calendar */}
          <div className="flex xl:hidden flex-col gap-4 w-full max-w-lg mt-4 max-h-[600px] overflow-y-auto pr-2">
            {[...leftImages, ...rightImages].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="School Calendar"
                className="w-full h-auto rounded-lg shadow-sm object-contain border border-gray-100"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
