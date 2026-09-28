import React from 'react';
import { ArrowRight, Compass, Shield, Sparkles } from 'lucide-react';
import { ImageFallback } from '../components/ImageFallback.tsx';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="space-y-24 py-12">
      {/* Editorial Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block">
            The VESTRA Atelier
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#1C1917] leading-[1.08] tracking-tight">
            In pursuit of architectural permanence and uncompromised drape.
          </h1>
          <p className="text-base text-[#57534E] leading-relaxed">
            Founded in 2021 as a rebellion against planned obsolescence in fashion, VESTRA operates on
            a single governing premise: true luxury is a garment whose construction outlives the
            transient trends of the era.
          </p>
        </div>
      </section>

      {/* Primary Visual Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-[16/9] w-full overflow-hidden border border-[#E7E5E4] shadow-md">
          <ImageFallback
            src="/src/assets/images/hero_vestra_editorial_1790603696949.jpg"
            alt="VESTRA Atelier runway presentation"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#E7E5E4] pt-16">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block">
              01. Provenance
            </span>
            <h3 className="text-2xl font-serif text-[#1C1917]">Noble Raw Fibers</h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              We reject petroleum-based synthetics. Our double-face cashmere is gathered from pasture
              flocks in Inner Mongolia during natural spring shedding, while our high-twist virgin
              wool is woven exclusively in Biella, Italy.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block">
              02. Construction
            </span>
            <h3 className="text-2xl font-serif text-[#1C1917]">Generational Tailoring</h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              Every jacket features a free-floating horsehair half-canvas chest piece that molds to
              the wearer’s body heat over months of wear. Lapels are hand-rolled; buttonholes are
              cut and bound by hand with silk gimp.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block">
              03. Responsibility
            </span>
            <h3 className="text-2xl font-serif text-[#1C1917]">Measured Batch Runs</h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              We never produce surplus inventory. When a mill run concludes, that edition is
              retired into our archives. This prevents landfill destruction and honors the manual
              labor invested in each weave.
            </p>
          </div>
        </div>
      </section>

      {/* Atelier Locations */}
      <section className="bg-[#F5F5F3] border-t border-b border-[#E7E5E4] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block">
              Global Workshops
            </span>
            <h2 className="text-3xl font-serif text-[#1C1917]">The European Ateliers</h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Our garments are created across three historic manufacturing regions known for specialized mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-[#E7E5E4] space-y-2">
              <span className="text-xs text-[#78716C] uppercase tracking-wider block">Woolen Mills</span>
              <h4 className="text-lg font-serif text-[#1C1917]">Biella, Italy</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Alpine snowmelt waters naturally wash our Super 130s wool yarns, giving them unmatched softness without chemical softeners.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#E7E5E4] space-y-2">
              <span className="text-xs text-[#78716C] uppercase tracking-wider block">Tailoring & Suiting</span>
              <h4 className="text-lg font-serif text-[#1C1917]">Porto, Portugal</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Family-owned workshops utilizing generational pattern-cutting techniques for architectural shoulder silhouettes.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#E7E5E4] space-y-2">
              <span className="text-xs text-[#78716C] uppercase tracking-wider block">Tubular Knitwear</span>
              <h4 className="text-lg font-serif text-[#1C1917]">Umbria, Italy</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Knitted on low-speed 7-gauge Shima Seiki machinery ensuring uninterrupted yarn tension and zero side-seams.
              </p>
            </div>
          </div>

          <div className="text-center pt-12">
            <button
              onClick={() => navigate('/shop')}
              className="bg-[#1C1917] text-white py-3 px-8 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Examine the Collection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
