import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { Product } from '../types/index.ts';
import { ImageFallback } from './ImageFallback.tsx';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  onQuickView,
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);

  const defaultSize = product.sizes[0] || 'M';
  const defaultColor = product.colors[0]?.name || 'Standard';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCardClick = () => {
    onNavigate(`/product/${product.slug || product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F3] border border-[#E7E5E4]">
        <ImageFallback
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.title}
          fallbackTitle={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#1C1917] hover:bg-white hover:text-rose-600 transition-all shadow-sm"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-[#44403C]'}`}
          />
        </button>

        {/* Subdued Status Indicator (Quiet unboxed text tag) */}
        {product.isNewArrival && (
          <div className="absolute top-3 left-3 z-10 text-[11px] tracking-widest uppercase font-semibold text-[#1C1917] bg-[#FAFAF9]/90 backdrop-blur-xs px-2 py-0.5 border border-[#E7E5E4]">
            New Edition
          </div>
        )}

        {/* Action Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-[#1C1917] text-white py-2 px-3 text-xs tracking-wider uppercase font-medium hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag</span>
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Inspect details"
              className="bg-white/95 text-[#1C1917] p-2 hover:bg-white transition-colors shadow-md border border-[#E7E5E4] cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Metadata (Quiet, unboxed text per Zero-Pill discipline) */}
      <div className="pt-3 pb-1 flex flex-col space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-[#78716C]">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>{product.origin.split(' in ')[1] || 'Italy'}</span>
        </div>

        <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-black line-clamp-1">
          {product.title}
        </h3>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-[#1C1917] tabular-nums">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#A8A29E] line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#78716C]">
            {product.colors.length} {product.colors.length === 1 ? 'shade' : 'shades'}
          </div>
        </div>
      </div>
    </div>
  );
};
