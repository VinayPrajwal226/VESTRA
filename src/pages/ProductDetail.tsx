import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { Product } from '../types/index.ts';

interface ProductDetailProps {
  idOrSlug: string;
  navigate: (path: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ idOrSlug, navigate }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // PDP States
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Accordion Toggles
  const [openAccordion, setOpenAccordion] = useState<string>('materials');

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(idOrSlug);
        if (res.success && res.product) {
          setProduct(res.product);
          setActiveImage(res.product.images[0] || '');
          setSelectedSize(res.product.sizes[0] || 'M');
          setSelectedColor(res.product.colors[0]?.name || 'Standard');
          setRelated(res.related || []);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-4 bg-[#E7E5E4] w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-[#E7E5E4]" />
          <div className="space-y-4">
            <div className="h-8 bg-[#E7E5E4] w-3/4" />
            <div className="h-6 bg-[#E7E5E4] w-1/4" />
            <div className="h-24 bg-[#E7E5E4]" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#1C1917]">Garment Not Found</h1>
        <p className="text-sm text-[#78716C]">The requested archival piece may have concluded its production run.</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-[#1C1917] text-white py-3 px-8 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await api.addProductReview(product.id, {
        rating: reviewRating,
        comment: reviewComment,
        userName: user?.name,
      });
      if (res.success && res.product) {
        setProduct(res.product);
        setReviewComment('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#78716C]">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-1.5 uppercase tracking-wider font-semibold hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Collection</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main PDP Grid: Gallery Left, Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Zone (Sticky on desktop) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-18 h-24 sm:w-20 sm:h-26 border overflow-hidden transition-all shrink-0 cursor-pointer ${
                    activeImage === img
                      ? 'border-[#1C1917] ring-1 ring-[#1C1917]'
                      : 'border-[#E7E5E4] opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageFallback
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Primary View */}
          <div className="flex-1 aspect-[3/4] bg-[#F5F5F3] border border-[#E7E5E4] overflow-hidden shadow-sm">
            <ImageFallback
              src={activeImage}
              alt={product.title}
              fallbackTitle={product.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>
        </div>

        {/* Contiguous Purchase Module Right */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Metadata */}
          <div className="space-y-2 pb-6 border-b border-[#E7E5E4]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#78716C] font-semibold">
              <span
                onClick={() => navigate(`/category/${product.category}`)}
                className="hover:underline cursor-pointer"
              >
                {product.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.origin}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917] leading-tight">
              {product.title}
            </h1>

            <p className="text-xs text-[#78716C] font-medium tracking-wide">
              {product.subtitle}
            </p>

            {/* Price and Rating */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-serif font-normal text-[#1C1917] tabular-nums">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#A8A29E] line-through tabular-nums">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {product.rating > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#44403C]">
                  <Star className="w-3.5 h-3.5 fill-[#1C1917] text-[#1C1917]" />
                  <span className="font-semibold tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-[#78716C]">({product.reviewsCount})</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {product.description}
          </p>

          {/* Tone / Color Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#1C1917]">
                Color Tone
              </span>
              <span className="text-[#78716C]">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border transition-all cursor-pointer ${
                    selectedColor === c.name
                      ? 'ring-2 ring-offset-2 ring-[#1C1917] scale-110'
                      : 'border-[#D6D3D1] hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size Selector with Live Stock Indicator */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#1C1917]">
                Size Specification
              </span>
              <span className="text-[#78716C]">
                {product.stockCount <= 5 ? (
                  <strong className="text-amber-800">Only {product.stockCount} remaining</strong>
                ) : (
                  `${product.stockCount} available`
                )}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 text-xs font-semibold tracking-wider border transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#1C1917]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Buy CTAs */}
          <div className="space-y-3 pt-4">
            <div className="flex gap-3">
              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  addedAnimation
                    ? 'bg-emerald-800 text-white'
                    : !product.inStock
                    ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                    : 'bg-[#1C1917] text-white hover:bg-black'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : !product.inStock ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag (${product.price * quantity})</span>
                  </>
                )}
              </button>

              {/* Wishlist Toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                className="p-4 border border-[#E7E5E4] bg-white hover:bg-[#F5F5F3] text-[#1C1917] transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-[#44403C]'
                  }`}
                />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-[#78716C] border-t border-[#E7E5E4]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>Complimentary courier over $300</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span>30-Day atelier exchange</span>
              </div>
            </div>
          </div>

          {/* Accordion Technical Specifications */}
          <div className="border-t border-[#E7E5E4] divide-y divide-[#E7E5E4] pt-2">
            {/* Materials & Provenance */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'materials' ? '' : 'materials')
                }
                className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#1C1917] cursor-pointer"
              >
                <span>Materials & Provenance</span>
                {openAccordion === 'materials' ? (
                  <ChevronUp className="w-4 h-4 text-[#78716C]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#78716C]" />
                )}
              </button>
              {openAccordion === 'materials' && (
                <div className="pb-4 text-xs text-[#57534E] space-y-2">
                  <p><strong>Composition:</strong> {product.materials}</p>
                  <p><strong>Atelier Origin:</strong> {product.origin}</p>
                  <p>
                    All yarns undergo rigorous tensile strength testing to guarantee dimensional
                    stability through years of wearing.
                  </p>
                </div>
              )}
            </div>

            {/* Fit & Silhouette */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'fit' ? '' : 'fit')
                }
                className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#1C1917] cursor-pointer"
              >
                <span>Fit & Sizing Architecture</span>
                {openAccordion === 'fit' ? (
                  <ChevronUp className="w-4 h-4 text-[#78716C]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#78716C]" />
                )}
              </button>
              {openAccordion === 'fit' && (
                <div className="pb-4 text-xs text-[#57534E] space-y-2">
                  <p><strong>Profile:</strong> {product.fit}</p>
                  <p>
                    Model is 6'1" / 185cm with a 38" chest, wearing size Medium.
                  </p>
                  <p>
                    For an oversized draping silhouette, choose your natural size. For a fitted
                    look, consider sizing down by one level.
                  </p>
                </div>
              )}
            </div>

            {/* Care & Preservation */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'care' ? '' : 'care')
                }
                className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#1C1917] cursor-pointer"
              >
                <span>Care & Preservation</span>
                {openAccordion === 'care' ? (
                  <ChevronUp className="w-4 h-4 text-[#78716C]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#78716C]" />
                )}
              </button>
              {openAccordion === 'care' && (
                <div className="pb-4 text-xs text-[#57534E] space-y-2">
                  <p>{product.careInstructions}</p>
                  <p>
                    Store in breathable canvas garment bag away from direct sunlight. We recommend
                    seasonal airing rather than frequent dry cleaning.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <section className="border-t border-[#E7E5E4] pt-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block mb-1">
              Client Feedback
            </span>
            <h2 className="text-2xl font-serif text-[#1C1917]">
              Collector Reviews & Verification
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-serif text-[#1C1917] tabular-nums">
              {product.rating.toFixed(1)}
            </span>
            <div className="text-xs text-[#78716C]">
              <div className="flex text-[#1C1917]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(product.rating)
                        ? 'fill-[#1C1917] text-[#1C1917]'
                        : 'text-[#D6D3D1]'
                    }`}
                  />
                ))}
              </div>
              <span>Based on {product.reviews.length} authentic purchases</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {product.reviews.length === 0 ? (
              <div className="p-8 bg-white border border-[#E7E5E4] text-center text-xs text-[#78716C]">
                Be the first to record an impression of this garment.
              </div>
            ) : (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-[#E7E5E4] p-6 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1C1917]">{rev.userName}</span>
                      <span className="text-[#A8A29E]">·</span>
                      <span className="text-emerald-700 flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Collector
                      </span>
                    </div>
                    <span className="text-[#78716C]">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex text-[#1C1917] pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'fill-[#1C1917] text-[#1C1917]' : 'text-[#D6D3D1]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-5 bg-[#F5F5F3] p-6 sm:p-8 border border-[#E7E5E4] space-y-4">
            <h3 className="text-base font-serif text-[#1C1917]">
              Submit Garment Impression
            </h3>
            <p className="text-xs text-[#78716C]">
              Share your feedback regarding the drape, fiber quality, and tailoring fit.
            </p>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                Thank you. Your impression has been recorded into the atelier archives.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-[#1C1917] text-[#1C1917]'
                              : 'text-[#D6D3D1]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                    Impression
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the fabric texture, fit against the body, and silhouette..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-3 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full bg-[#1C1917] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Recording...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Curated Coordinates / Related Products */}
      {related.length > 0 && (
        <section className="border-t border-[#E7E5E4] pt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-[#1C1917]">
              Curated Coordinates
            </h2>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#78716C] cursor-pointer"
            >
              View All Pieces →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={navigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
