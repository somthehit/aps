import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Mail, Phone, MessageCircle, BookOpen, ChevronRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help and support for Shree Alankar Public School mobile app and website.",
};

const faqs = [
  {
    q: "How can I check my child's exam results?",
    a: "You can view published results by navigating to the Results section on our website or mobile app. Enter the student's roll number to access individual marksheets.",
  },
  {
    q: "How do I apply for admission?",
    a: "Visit the Admission page and fill out the inquiry form. Our administration team will contact you within 2-3 business days with further instructions regarding the application process.",
  },
  {
    q: "How can I contact a teacher?",
    a: "You can reach out via the Contact Us page or call the school office at 099422015 during office hours. Messages are forwarded to the respective faculty members.",
  },
  {
    q: "Is my data safe on this app?",
    a: "Yes. We use encrypted connections and secure servers. Please refer to our Privacy Policy for detailed information on how we protect your data.",
  },
  {
    q: "How do I report a technical issue?",
    a: "Please email us at alankarpublicschool@gmail.com with a description of the issue, screenshots if applicable, and your device details. Our technical team will respond within 48 hours.",
  },
  {
    q: "Can I update my contact information?",
    a: "Yes. Contact the school administration directly via phone or email to update your contact details. You may also visit the school office during working hours.",
  },
];

export default function SupportPage() {
  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-4xl mx-auto w-full">
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          SUPPORT
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          Help & Support
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          Find answers to common questions or get in touch with our support team.
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow flex items-start gap-4">
          <div className="p-3 bg-[#1a3a2a]/5 text-[#c9a227] border border-[#c9a227]/25 rounded-full shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1a3a2a] font-serif">Email Support</h3>
            <p className="text-xs text-[#444444] mt-1">alankarpublicschool@gmail.com</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Response within 48 hours</p>
          </div>
        </div>

        <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow flex items-start gap-4">
          <div className="p-3 bg-[#1a3a2a]/5 text-[#c9a227] border border-[#c9a227]/25 rounded-full shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1a3a2a] font-serif">Phone Support</h3>
            <p className="text-xs text-[#444444] mt-1">099422015</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Sun-Thu 10AM-4PM</p>
          </div>
        </div>

        <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow flex items-start gap-4">
          <div className="p-3 bg-[#1a3a2a]/5 text-[#c9a227] border border-[#c9a227]/25 rounded-full shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1a3a2a] font-serif">Visit Us</h3>
            <p className="text-xs text-[#444444] mt-1">Punarbas-8, Kanchanpur</p>
            <p className="text-[10px] text-slate-400 mt-0.5">School office hours</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow mb-8">
        <h2 className="text-xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#c9a227]" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-[#c9a227]/20 rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer bg-[#fdf6e3]/30 hover:bg-[#fdf6e3]/60 transition-colors list-none">
                <span className="text-sm font-bold text-[#1a3a2a] font-serif flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1a3a2a] text-[#c9a227] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  {faq.q}
                </span>
                <ChevronRight className="w-4 h-4 text-[#c9a227] shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="p-4 pt-0 border-t border-[#c9a227]/10">
                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed mt-3">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-[#1a3a2a]/5 border border-[#c9a227]/20 rounded-lg p-6 text-center">
        <h3 className="text-base font-bold font-serif text-[#1a3a2a] mb-2">Still need help?</h3>
        <p className="text-xs text-[#444444]/70 mb-4 font-sans">
          Our team is ready to assist you with any questions or concerns.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1a3a2a] text-white border border-[#c9a227] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#102419] transition-colors"
          >
            <Mail className="w-4 h-4 text-[#c9a227]" />
            Contact Form
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#1a3a2a] border border-[#c9a227]/40 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#fdf6e3] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
