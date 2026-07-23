import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Mail, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Shree Alankar Public School mobile app and website.",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-4xl mx-auto w-full">
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" />
          PRIVACY POLICY
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          Effective Date: 2081 BS · Last updated: 2081 BS
        </p>
      </div>

      <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow space-y-6 text-sm text-[#444444] leading-relaxed font-sans">
        <p>
          Shree Alankar Public School (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy of students, parents, guardians, and visitors to our mobile application and website. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information.
        </p>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Personal Data:</strong> Name, email address, phone number, and mailing address provided through contact forms or admission inquiries.</li>
            <li><strong>Student Data:</strong> Student name, grade, roll number, academic records, and attendance information (provided by parents/guardians).</li>
            <li><strong>Device Data:</strong> Device type, operating system, and app version for analytics and troubleshooting.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, and interactions within the app or website.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">2. How We Use Your Information</h2>
          <p>We use collected information for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>To process admission inquiries and communicate with applicants.</li>
            <li>To provide academic information, exam results, and school notices.</li>
            <li>To improve the app and website experience.</li>
            <li>To respond to support requests and inquiries.</li>
            <li>To comply with legal obligations and school governance requirements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">3. Data Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share data only in the following cases:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>With service providers who assist in app development, hosting, and analytics (e.g., Supabase, Vercel).</li>
            <li>When required by law or to protect the rights and safety of the school community.</li>
            <li>With parental or legal guardian consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. These include encrypted connections (HTTPS), secure database storage, and restricted access controls.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">5. Data Retention</h2>
          <p>
            We retain personal data only for as long as necessary to fulfill the purposes described in this policy, or as required by applicable law. Admission records and academic data may be retained for the duration of a student&apos;s enrollment and for a reasonable period thereafter.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access, update, or correct your personal data.</li>
            <li>Request deletion of your data, subject to legal retention requirements.</li>
            <li>Opt out of non-essential communications.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p className="mt-2">To exercise these rights, please contact us using the information below.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">7. Third-Party Services</h2>
          <p>
            Our app and website use the following third-party services, each with its own privacy policy:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Supabase (database and authentication)</li>
            <li>Vercel (hosting)</li>
            <li>Google Maps (location embedding)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">8. Children&apos;s Privacy</h2>
          <p>
            We collect student information only from parents, guardians, or authorized school staff. We do not knowingly collect personal information directly from children under 13 without parental consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-serif text-[#1a3a2a] mb-3">10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <div className="mt-3 p-4 bg-[#fdf6e3]/50 border border-[#c9a227]/20 rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#c9a227]" />
              <span className="font-semibold">alankarpublicschool@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#c9a227]" />
              <span>Shree Alankar Public School, Punarbas-8, Kanchanpur, Nepal</span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-[#1a3a2a] font-bold text-xs uppercase tracking-wider hover:text-[#c9a227] transition-colors"
            >
              Contact Us <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
