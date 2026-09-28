import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Clock, Mail, MapPin, Phone } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'Bespoke Fitting Appointment',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does VESTRA ensure fabric provenance and ethical traceability?',
      a: 'Every fabric bolt is accompanied by mill batch credentials. Our Mongolian cashmere is sourced through cooperatives certified under Sustainable Fibre Alliance standards, ensuring pasture health and fair herder remuneration.',
    },
    {
      q: 'Can I schedule a private atelier fitting or styling consultation?',
      a: 'Yes. We host private appointments at our Manhattan and Milan showrooms where our master tailors can take bespoke measurements and pin custom alterations for off-the-rack garments.',
    },
    {
      q: 'What is your complimentary exchange and return policy?',
      a: 'We provide complimentary courier returns within 30 days of physical delivery for any unworn garment with original tags and cedar garment bag intact.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, select domestic regions support Cash on Delivery with no additional surcharge. You may inspect the parcel exterior before remitting cash to our courier partner.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block">
          Client Concierge
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#1C1917]">
          Connect with the Atelier
        </h1>
        <p className="text-sm text-[#57534E] leading-relaxed">
          Whether inquiring about garment fit, reserving private fittings, or requesting archival restorations, our concierge team is at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#F5F5F3] p-8 sm:p-10 border border-[#E7E5E4] space-y-6">
          <h2 className="text-xl font-serif text-[#1C1917]">
            Private Inquiry Form
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="w-5 h-5 text-emerald-700" />
                <span>Inquiry Dispatched</span>
              </div>
              <p className="text-xs leading-relaxed">
                Thank you, {form.name}. A senior client liaison will respond via {form.email} within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Subject Matter
                </label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                >
                  <option>Bespoke Fitting Appointment</option>
                  <option>Garment Sizing & Fit Consultation</option>
                  <option>Archive Restoration Request</option>
                  <option>Press & Editorial Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Detailed Inquiry
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Detail your request, preferred dates, or specific garments..."
                  className="w-full bg-white border border-[#E7E5E4] p-3 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1C1917] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Transmit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Showrooms & Salons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E7E5E4] p-6 space-y-4">
            <h3 className="text-base font-serif text-[#1C1917]">
              Manhattan Flagship Salon
            </h3>
            <div className="space-y-2 text-xs text-[#57534E]">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>740 Mercer Street, Soho, New York, NY 10012</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>Tuesday – Saturday: 11:00 AM – 7:00 PM</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>+1 (212) 555-0198</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>concierge@vestra.com</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E7E5E4] p-6 space-y-4">
            <h3 className="text-base font-serif text-[#1C1917]">
              Milan Private Fitting Studio
            </h3>
            <div className="space-y-2 text-xs text-[#57534E]">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>Via Montenapoleone 18, 20121 Milano, Italy</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>By Private Advance Appointment Only</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="border-t border-[#E7E5E4] pt-16 space-y-6">
        <h2 className="text-2xl font-serif text-[#1C1917]">
          Frequently Addressed Questions
        </h2>
        <div className="border border-[#E7E5E4] bg-white divide-y divide-[#E7E5E4]">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAFAF9]"
              >
                <span className="text-sm font-medium text-[#1C1917]">{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-[#78716C] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#78716C] shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs text-[#57534E] leading-relaxed border-t border-[#F5F5F3] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
