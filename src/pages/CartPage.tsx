import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { useCart } from '../context/CartContext.tsx';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    shippingFee,
    promoCode,
    discount,
    applyPromo,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ text: res.message, isError: !res.success });
  };

  const estimatedTax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const estimatedTotal = Math.max(0, subtotal - discount + shippingFee + estimatedTax);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 stroke-[1] text-[#A8A29E] mx-auto" />
        <h1 className="text-3xl font-serif text-[#1C1917]">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#78716C] max-w-sm mx-auto">
          Explore our seasonal drops, bespoke knitwear, and architectural tailoring to curate your collection.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-[#1C1917] text-white py-3.5 px-8 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="border-b border-[#E7E5E4] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#78716C] hover:text-[#1C1917] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917]">
            Shopping Bag ({items.length} {items.length === 1 ? 'Design' : 'Designs'})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Itemized Table */}
        <div className="lg:col-span-8 divide-y divide-[#E7E5E4]">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
              className="py-6 flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="w-28 h-36 bg-[#F5F5F3] border border-[#E7E5E4] overflow-hidden shrink-0">
                <ImageFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between h-36">
                <div>
                  <div className="flex justify-between items-start">
                    <h3
                      onClick={() => navigate(`/product/${item.productId}`)}
                      className="text-base font-serif text-[#1C1917] hover:underline cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <span className="text-base font-medium text-[#1C1917] tabular-nums">
                      ${item.price * item.quantity}
                    </span>
                  </div>

                  <div className="text-xs text-[#78716C] mt-1 space-x-3">
                    <span>Size: <strong className="text-[#1C1917]">{item.selectedSize}</strong></span>
                    <span>·</span>
                    <span>Tone: <strong className="text-[#1C1917]">{item.selectedColor}</strong></span>
                    <span>·</span>
                    <span>Unit: <strong className="text-[#1C1917] tabular-nums">${item.price}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E4]">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E7E5E4] bg-white">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity - 1
                        )
                      }
                      className="p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#1C1917] tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity + 1
                        )
                      }
                      className="p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.productId, item.selectedSize, item.selectedColor)
                    }
                    className="text-xs text-[#78716C] hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-[#F5F5F3] border border-[#E7E5E4] p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-serif text-[#1C1917] border-b border-[#E7E5E4] pb-3">
            Summary Breakdown
          </h2>

          {/* Promo code field */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] block">
              Promotional Courtesy
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code (e.g. VESTRA10)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-white border border-[#E7E5E4] px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:border-[#1C1917]"
              />
              <button
                type="submit"
                className="bg-[#1C1917] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className={`text-xs ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                {promoMessage.text}
              </p>
            )}
            {promoCode && !promoMessage && (
              <p className="text-xs text-emerald-700">Code {promoCode} active</p>
            )}
          </form>

          {/* Breakdown items */}
          <div className="space-y-2.5 text-xs text-[#78716C] border-t border-[#E7E5E4] pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1C1917] tabular-nums">${subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Discount</span>
                <span className="tabular-nums">-${discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Global Courier</span>
              <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="tabular-nums">${estimatedTax}</span>
            </div>

            <div className="flex justify-between text-base font-semibold text-[#1C1917] pt-4 border-t border-[#E7E5E4]">
              <span>Estimated Total</span>
              <span className="tabular-nums font-serif text-lg">${estimatedTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#1C1917] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-[#78716C]">
            Taxes, duties, and courier insurance calculated at final step.
          </p>
        </div>
      </div>
    </div>
  );
};
