import React from 'react';
import { ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Document</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35]">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Last Updated: October 2026 • <em>(Draft Policy for Website Review)</em>
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
        <strong>Administrator Notice:</strong> This is a standard draft privacy statement for Baunduilla's travel agency website. The owner should review and adapt it to reflect exact third-party services and jurisdictional requirements before final commercial publication.
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">1. Information We Collect</h2>
          <p>
            When you inquire about a tour package, request a custom trip, or contact us via WhatsApp or website forms, we collect the necessary details to process your travel inquiry:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Full Name</li>
            <li>Contact Phone / WhatsApp Number</li>
            <li>Email Address</li>
            <li>Preferred Travel Dates and Group Size</li>
            <li>Specific dietary, medical, or travel preferences shared voluntarily</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">2. How Your Information is Used</h2>
          <p>
            We use your personal information strictly for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Communicating quotes, itineraries, and booking updates</li>
            <li>Applying for required government forest and Inner Line Permits (ILP) on your behalf</li>
            <li>Coordinating hotel and vehicle logistics with local partners in Sikkim, Dooars, Spiti, etc.</li>
          </ul>
          <p className="text-xs text-stone-500">
            We never sell, rent, or trade your personal data to marketing third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">3. Document Storage & Security</h2>
          <p>
            Identity documents (such as Voter ID copies or passport photos provided for high-altitude permit processing) are handled solely by authorized travel desk coordinators and shared strictly with respective government district magistrate/police checkpoints as mandated by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">4. WhatsApp & Third-Party Links</h2>
          <p>
            Our website provides direct click-to-chat links to WhatsApp. Interactions within WhatsApp are governed by WhatsApp's own privacy policy and encryption standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">5. Contact Us Regarding Your Data</h2>
          <p>
            To update or request deletion of your inquiry data, email us at <a href="mailto:contact.baunduilla@gmail.com" className="text-[#173F35] font-semibold underline">contact.baunduilla@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <FileText className="w-4 h-4" />
          <span>Terms of Service</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35]">
          Terms and Conditions
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Last Updated: October 2026 • <em>(Draft Tour Booking Agreement)</em>
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
        <strong>Notice:</strong> These terms govern tour inquiries and small-group expeditions operated by Baunduilla. The website owner should verify these conditions with appropriate legal counsel before operational deployment.
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">1. Booking Confirmation & Quotations</h2>
          <p>
            Submitting a website inquiry or WhatsApp message does not guarantee reservation of seats, permits, or hotel rooms. A booking is confirmed only upon verification of slot availability and receipt of the agreed deposit payment alongside an official Baunduilla booking invoice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">2. Mountain Weather & Force Majeure</h2>
          <p>
            High-altitude travel in the Himalayas (including North Sikkim, Spiti Valley, and Arunachal Pradesh) involves exposure to unpredictable elements including sudden snowfalls, landslides, road closures, and military convoy movements.
          </p>
          <p>
            In circumstances of force majeure or government road blockades, Baunduilla reserves the right to re-route itineraries for traveler safety. Extra days or emergency stay costs arising directly from road blockages are payable directly by guests.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">3. Permits & Identity Compliance</h2>
          <p>
            Travelers are responsible for carrying valid original government identity cards (Voter ID or Passport for border zones) and providing required photographs. Baunduilla cannot be held liable if access is denied by authorities due to invalid or expired guest documentation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">4. Health, Fitness & Altitude Acclimatization</h2>
          <p>
            Certain itineraries involve altitudes exceeding 14,000 ft (e.g., Gurudongmar Lake, Chandratal, Sela Pass). Travelers must disclose pre-existing respiratory or cardiovascular conditions. Trek participants must adhere to trek leaders' safety instructions at all times.
          </p>
        </section>
      </div>
    </div>
  );
};

export const CancellationPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <AlertCircle className="w-4 h-4" />
          <span>Policies & Refunds</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35]">
          Cancellation and Refund Policy
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Last Updated: October 2026 • <em>(Transparent Mountain Cancellation Schedule)</em>
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">
            Standard Cancellation Refund Schedule
          </h2>
          <p>
            Because mountain tour operations require advance non-refundable permits, dedicated commercial vehicle allotments, and small homestay reservations, the following cancellation schedule applies:
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-[#173F35] text-white">
                <tr>
                  <th className="p-3">Notice Period Prior to Trip Start</th>
                  <th className="p-3">Refund Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr className="bg-stone-50">
                  <td className="p-3 font-semibold">30 Days or more before departure</td>
                  <td className="p-3 text-emerald-700 font-bold">90% Refund (10% processing fee retained)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">15 to 29 Days before departure</td>
                  <td className="p-3 text-amber-700 font-bold">50% Refund</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-3 font-semibold">Less than 15 Days before departure</td>
                  <td className="p-3 text-red-600 font-bold">Non-refundable (0% Refund)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2 pt-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">Date Rescheduling & Credit Vouchers</h2>
          <p>
            In cases of unforeseen personal emergencies or natural road closures before trip commencement, we make every reasonable effort with local homestay and driver unions to issue a <strong>travel credit voucher</strong> valid for 12 months, minus non-recoverable permit costs.
          </p>
        </section>

        <section className="space-y-2 pt-2">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">How to Request a Cancellation</h2>
          <p>
            All cancellation requests must be sent in writing from the registered traveler email to <a href="mailto:contact.baunduilla@gmail.com" className="text-[#173F35] font-semibold underline">contact.baunduilla@gmail.com</a> along with your Booking Reference ID.
          </p>
        </section>
      </div>
    </div>
  );
};
