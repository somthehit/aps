import type { Metadata } from 'next';
import Link from 'next/link';
import { Notice, HeroSlide } from '@/lib/schema';

import HeroSlider from '@/components/HeroSlider';
import BSCalendar from '@/components/BSCalendar';
import CalendarWidget from '@/components/CalendarWidget';

export const metadata: Metadata = {
  title: 'Shree Alankar Public School | Kanchanpur, Nepal',
  description: 'Official website of Shree Alankar Public School, Punarbas-8, Prithvibasti, Kanchanpur, Nepal. Established 2066 BS.',
};

async function getLatestNotices(): Promise<Notice[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/notices?limit=4`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/hero-slides`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const allSlides = json.data || [];
    return allSlides.filter((s: any) => s.is_active);
  } catch {
    return [];
  }
}

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch {
    return {};
  }
}

async function getEvents(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/events`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

const getStats = (settings: Record<string, string>) => [
  { value: settings.total_students || '847+', label_en: 'Students', label_np: 'विद्यार्थीहरू', icon: '👩‍🎓' },
  { value: settings.total_staff || '42', label_en: 'Staff Members', label_np: 'शिक्षक/कर्मचारी', icon: '👨‍🏫' },
  { value: settings.established_year_bs || '2066', label_en: 'Established (BS)', label_np: 'स्थापना (BS)', icon: '📅' },
  { value: settings.school_classes || 'PG–8', label_en: 'Classes', label_np: 'कक्षाहरू', icon: '📚' },
];

const quickLinks = [
  { href: '/admission', icon: '📋', label_en: 'Apply for Admission', label_np: 'भर्नाको लागि आवेदन', desc: 'Join our school community' },
  { href: '/results', icon: '🏆', label_en: 'Check Results', label_np: 'नतिजा हेर्नुहोस्', desc: 'View academic performance' },
  { href: '/gallery', icon: '🖼️', label_en: 'Photo Gallery', label_np: 'फोटो ग्यालेरी', desc: 'Moments from school life' },
  { href: '/notices', icon: '📢', label_en: 'Notice Board', label_np: 'सूचना पाटी', desc: 'Latest announcements' },
];

const upcomingEvents = [
  { date_bs: 'जेठ २५, २०८१', date_en: 'June 8, 2025', event_en: 'Parent-Teacher Meeting', event_np: 'अभिभावक-शिक्षक बैठक' },
  { date_bs: 'असार १५, २०८१', date_en: 'June 28, 2025', event_en: 'Annual Sports Day', event_np: 'वार्षिक खेलकुद दिवस' },
  { date_bs: 'साउन ५, २०८१', date_en: 'July 20, 2025', event_en: 'First Terminal Exam Begins', event_np: 'प्रथम टर्मिनल परीक्षा शुरु' },
  { date_bs: 'भाद्र १, २०८१', date_en: 'Aug 17, 2025', event_en: 'Independence Day Celebration', event_np: 'स्वतन्त्रता दिवस उत्सव' },
  { date_bs: 'असोज २८, २०८१', date_en: 'Oct 14, 2025', event_en: 'Dashain Holidays Begin', event_np: 'दशैँ बिदा शुरु' },
];

const categoryColors: Record<string, string> = {
  admission: '#0d9488', results: '#dc2626', event: '#d97706',
  meeting: '#4f46e5', holiday: '#0891b2', general: '#6b7280',
};

export default async function HomePage() {
  const notices = await getLatestNotices();
  const heroSlides = await getActiveHeroSlides();
  const siteSettings = await getSiteSettings();
  const events = await getEvents();

  const stats = getStats(siteSettings);

  const displayEvents = events.length > 0 ? events.map(e => ({
    date_bs: e.date_bs,
    date_en: new Date(e.date_en).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    event_en: e.title_en,
    event_np: e.title_np
  })) : upcomingEvents;

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO — Full Background Slider with Blur ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-slate-900">
          <HeroSlider slides={heroSlides} fullBg />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-0">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Established {siteSettings.established_year_bs || '2066'} BS</span>
            </div>

            <div>
              <p className="text-amber-300 font-medium text-sm md:text-base tracking-wide mb-1 nepali-text">श्री अलंकार पब्लिक स्कूल</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="text-red-500">Shree Alankar</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Public School</span>
              </h1>
            </div>

            <p className="text-base md:text-lg text-white/80 max-w-lg leading-relaxed">
              Nurturing young minds from <strong className="text-white">Play Group to Grade 8</strong> with quality education rooted in Nepali values and modern global perspectives.
            </p>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Punarbas-8, &quot;Ka Gau&quot;, Kanchanpur, Nepal
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/admission"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all">
                Apply for Admission
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all">
                Explore School
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative -mt-10 z-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/80 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-3xl font-black text-slate-800">{s.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-500">{s.label_en}</p>
              <p className="text-xs text-slate-400 nepali-text">{s.label_np}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── LATEST NOTICES + QUICK LINKS ── */}
        <section className="py-20 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Latest Notices</h2>
                <p className="text-sm text-slate-500 mt-1 nepali-text">ताजा सूचनाहरू</p>
              </div>
              <Link href="/notices" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                View All
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="space-y-3">
              {notices.length > 0 ? notices.map((n) => (
                <div key={n.id} className="group flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-200 hover:bg-teal-50/40 transition-all duration-200">
                  <div className="flex-shrink-0 mt-0.5">
                    {n.is_pinned ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pinned
                      </span>
                    ) : (
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize"
                        style={{ background: `${categoryColors[n.category] || '#6b7280'}15`, color: categoryColors[n.category] || '#6b7280' }}>
                        {n.category}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 group-hover:text-teal-700 transition-colors">{n.title_en}</p>
                    <p className="text-xs mt-0.5 text-slate-500 nepali-text">{n.title_np}</p>
                    <p className="text-xs mt-1.5 text-slate-400">{new Date(n.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-teal-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </div>
              )) : (
                [
                  { id: 1, title_en: 'Admission Open for PG to Eight (2081 BS)', title_np: 'PG देखि आठ सम्म भर्ना खुला (२०८१ BS)', category: 'admission', is_pinned: true, published_at: new Date() },
                  { id: 2, title_en: 'SEE 2080 Results Published', title_np: 'SEE २०८० नतिजा प्रकाशित', category: 'results', is_pinned: false, published_at: new Date() },
                  { id: 3, title_en: 'Annual Sports Day - Ashad 15', title_np: 'वार्षिक खेलकुद दिवस - असार १५', category: 'event', is_pinned: false, published_at: new Date() },
                ].map((n) => (
                  <div key={n.id} className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0 mt-0.5"
                      style={{ background: `${categoryColors[n.category] || '#6b7280'}15`, color: categoryColors[n.category] || '#6b7280' }}>
                      {n.category}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{n.title_en}</p>
                      <p className="text-xs mt-0.5 text-slate-500 nepali-text">{n.title_np}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Quick Access</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6 nepali-text">द्रुत पहुँच</p>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, i) => (
                <Link key={i} href={link.href}
                  className="group flex flex-col items-center text-center p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <span className="text-3xl mb-2">{link.icon}</span>
                  <span className="font-semibold text-xs text-slate-700 group-hover:text-teal-600 transition-colors">{link.label_en}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 nepali-text">{link.label_np}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT / MISSION DIVIDER ── */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">About Our School</span>
          </div>
        </div>

        {/* ── PRINCIPAL MESSAGE ── */}
        <section className="py-12 grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            <div className="relative mb-5">
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-5xl shadow-xl shadow-teal-200/50">
                🎓
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-lg shadow-lg">
                ✨
              </div>
            </div>
            <h3 className="font-bold text-xl text-slate-800">Pusp Raj Ojha</h3>
            <p className="text-sm font-medium text-teal-600">Principal / प्रधानाध्यापक</p>
            <p className="text-xs text-slate-400 mt-0.5">M.Ed. (Education Management)</p>
          </div>
          <div className="lg:col-span-3">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
              <div className="text-5xl absolute -top-3 left-5 text-teal-200/50 font-serif leading-none">&ldquo;</div>
              <div className="relative z-10 space-y-4">
                <p className="text-sm leading-relaxed text-slate-600 italic">
                  Welcome to Shree Alankar Public School. Our mission is to nurture young minds with quality education rooted in Nepali values and global perspectives. We believe every child has immense potential, and our dedicated faculty strives to help each student realize their full capabilities.
                </p>
                <p className="text-sm leading-relaxed text-slate-500 nepali-text">
                  श्री अलंकार पब्लिक स्कूलमा स्वागत छ। हाम्रो लक्ष्य नेपाली मूल्य र वैश्विक दृष्टिकोणमा आधारित गुणस्तरीय शिक्षाद्वारा युवा मनहरूलाई पोषण दिनु हो।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">School Events</span>
          </div>
        </div>

        {/* ── UPCOMING EVENTS ── */}
        <section className="py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Upcoming Events</h2>
              <p className="text-sm text-slate-500 mt-1 nepali-text">आगामी कार्यक्रमहरू</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayEvents.map((ev, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-600 nepali-text">{ev.date_bs}</p>
                    <p className="text-xs text-slate-400">{ev.date_en}</p>
                  </div>
                </div>
                <p className="font-semibold text-sm text-slate-800 group-hover:text-teal-700 transition-colors">{ev.event_en}</p>
                <p className="text-xs mt-1 text-slate-500 nepali-text">{ev.event_np}</p>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-medium text-teal-600 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                    View details
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <CalendarWidget />
          </div>
          <div className="mt-12">
            <BSCalendar />
          </div>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer className="mt-12 bg-slate-900">
        <div className="h-1 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <h4 className="text-white font-bold text-base mb-2">Shree Alankar Public School</h4>
              <p className="text-xs text-slate-400 nepali-text mb-3">श्री अलंकार पब्लिक स्कूल</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Punarbas-8, &quot;Ka Gau&quot;, Kanchanpur, Nepal
              </p>
              {siteSettings?.emis ? (
                <p className="text-xs text-amber-400/70 mt-2">EMIS: {siteSettings.emis}</p>
              ) : null}
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm mb-3">Quick Links</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                <li><Link href="/academics" className="hover:text-amber-400 transition-colors">Academics</Link></li>
                <li><Link href="/admission" className="hover:text-amber-400 transition-colors">Admission</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm mb-3">Contact</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Principal: Pusp Raj Ojha</li>
                <li>Est. {siteSettings.established_year_bs || '2066'} BS</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-600">© 2081 BS · Shree Alankar Public School · All rights reserved</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
