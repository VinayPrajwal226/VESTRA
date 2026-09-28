import React, { useState } from 'react';
import { Check, Heart, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { Product } from '../types/index.ts';
import { ImageFallback } from './ImageFallback.tsx';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onNavigate,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAFAF9] max-w-3xl w-full border border-[#E7E5E4] shadow-2xl z-10 overflow-hidden my-8">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full text-[#44403C] hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="bg-[#F5F5F3] relative p-4 flex flex-col justify-center">
            <div className="aspect-[3/4] w-full overflow-hidden border border-[#E7E5E4]">
              <ImageFallback
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-18 border shrink-0 overflow-hidden transition-all ${
                      selectedImage === img ? 'border-[#1C1917]' : 'border-[#E7E5E4] opacity-60'
                    }`}
                  >
                    <ImageFallback src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[11px] tracking-wider uppercase text-[#78716C] font-semibold">
                {product.category} · {product.origin}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif text-[#1C1917]">
                {product.title}
              </h2>

              <div className="flex items-center gap-3 text-lg font-medium text-[#1C1917] tabular-nums">
                <span>${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#A8A29E] line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-2">
                  Tone: <span className="font-normal text-[#78716C]">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'ring-2 ring-offset-2 ring-[#1C1917] scale-110'
                          : 'border-[#D6D3D1]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C]">
                    Size: <span className="font-normal text-[#78716C]">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-[#78716C]">
                    {product.stockCount} in stock
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#1C1917] text-white border-[#1C1917]'
                          : 'bg-white border-[#E7E5E4] text-[#44403C] hover:border-[#1C1917]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-800 text-white'
                      : !product.inStock
                      ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                      : 'bg-[#1C1917] text-white hover:bg-black'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : !product.inStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className="p-3 border border-[#E7E5E4] bg-white hover:bg-[#F5F5F3] text-[#1C1917] transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-[#44403C]'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigate(`/product/${product.slug || product.id}`);
                }}
                className="w-full text-center text-xs text-[#78716C] hover:text-[#1C1917] underline underline-offset-4 transition-colors cursor-pointer"
              >
                View Full Garment Specification & Care Guide →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
