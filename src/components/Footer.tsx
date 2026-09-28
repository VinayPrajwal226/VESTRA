import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1C1917] text-[#D6D3D1] border-t border-[#292524] pt-20 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#292524]">
          {/* Brand Manifesto Zone */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-2xl font-serif tracking-[0.25em] text-[#FAFAF9] block uppercase">
              VESTRA
            </span>
            <p className="text-sm text-[#A8A29E] leading-relaxed max-w-sm">
              An independent ready-to-wear house defined by architectural silhouettes, noble raw
              fibers, and generational Italian and Portuguese craftsmanship.
            </p>
            <div className="text-xs text-[#78716C] pt-2 space-y-1">
              <p>Ateliers: Biella, Italy · Porto, Portugal</p>
              <p>Showroom: 740 Mercer St, New York, NY</p>
            </div>
          </div>

          {/* Quick Collection Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAFAF9]">
              Collection
            </h4>
            <ul className="space-y-2 text-sm text-[#A8A29E]">
              <li>
                <button
                  onClick={() => navigate('/shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Garments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/outerwear')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Outerwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/tailoring')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tailoring & Suits
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/knitwear')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cashmere Knitwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/essentials')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fine Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Maison & Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAFAF9]">
              Maison
            </h4>
            <ul className="space-y-2 text-sm text-[#A8A29E]">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Client Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Private Fittings
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Care & Preservation
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Dispatch */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAFAF9]">
              Private Dispatch
            </h4>
            <p className="text-sm text-[#A8A29E]">
              Receive intimate previews of limited seasonal capsule releases and private salon
              invitations.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-[#E7E5E4] bg-[#292524] p-3 rounded">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You are subscribed to the VESTRA Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-stretch max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#292524] text-white px-4 py-2.5 text-sm placeholder-[#78716C] border border-[#44403C] focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="bg-[#FAFAF9] text-[#1C1917] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>© {new Date().getFullYear()} VESTRA Ready-to-Wear Atelier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/about')}
              className="hover:text-[#A8A29E] transition-colors cursor-pointer"
            >
              Ethics & Traceability
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="hover:text-[#A8A29E] transition-colors cursor-pointer"
            >
              Terms of Concierge
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="text-[#57534E] hover:text-[#A8A29E] transition-colors cursor-pointer"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
