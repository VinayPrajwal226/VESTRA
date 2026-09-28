import React, { useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { ImageFallback } from './ImageFallback.tsx';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    itemCount,
    subtotal,
    freeShippingThreshold,
    promoCode,
    discount,
    applyPromo,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ text: res.message, isError: !res.success });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAFAF9] shadow-2xl flex flex-col border-l border-[#E7E5E4]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E7E5E4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1C1917]" strokeWidth={1.5} />
              <h2 className="text-lg font-serif tracking-wide text-[#1C1917]">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close bag"
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-[#F5F5F3] px-6 py-3 border-b border-[#E7E5E4]">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-[#57534E]">
                Add <span className="font-semibold text-[#1C1917] tabular-nums">${remainingForFreeShipping}</span> more for complimentary courier delivery.
              </p>
            ) : (
              <p className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                <span>✓</span> Complimentary global courier delivery unlocked.
              </p>
            )}
            <div className="w-full bg-[#E7E5E4] h-1 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1C1917] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E7E5E4]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#78716C]">
                <ShoppingBag className="w-12 h-12 stroke-[1] text-[#A8A29E] mb-3" />
                <p className="font-serif text-lg text-[#1C1917]">Your bag is empty</p>
                <p className="text-xs mt-1 max-w-[240px]">
                  Explore our seasonal tailoring, noble knitwear, and timeless wardrobe anchors.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="mt-6 bg-[#1C1917] text-white text-xs uppercase tracking-wider py-2.5 px-6 font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="py-4 flex gap-4">
                  <div className="w-20 h-26 bg-[#F5F5F3] shrink-0 border border-[#E7E5E4] overflow-hidden">
                    <ImageFallback
                      src={item.image}
                      alt={item.title}
                      fallbackTitle={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-[#1C1917] line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                          className="text-[#A8A29E] hover:text-[#DC2626] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#78716C] mt-1 space-x-2">
                        <span>Size: <strong className="text-[#44403C]">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span>Tone: <strong className="text-[#44403C]">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
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
                          aria-label="Decrease quantity"
                          className="p-1 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#1C1917] tabular-nums">
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
                          aria-label="Increase quantity"
                          className="p-1 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-medium text-[#1C1917] tabular-nums">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E7E5E4] bg-[#FAFAF9] space-y-4">
              {/* Promo code field */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. VESTRA10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 bg-white border border-[#E7E5E4] px-3 py-1.5 text-xs text-[#1C1917] uppercase placeholder:normal-case placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
                />
                <button
                  type="submit"
                  className="bg-[#E7E5E4] text-[#1C1917] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#D6D3D1] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-xs ${
                    promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
              {promoCode && !promoMessage && (
                <p className="text-xs text-emerald-700">Code {promoCode} is active</p>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-[#78716C] pt-2 border-t border-[#E7E5E4]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1C1917] tabular-nums">${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promotional Courtesy</span>
                    <span className="tabular-nums">-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Delivery</span>
                  <span>{subtotal >= freeShippingThreshold ? 'Complimentary' : '$25'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1C1917] pt-2 border-t border-[#E7E5E4]">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">
                    ${Math.max(0, subtotal - discount + (subtotal >= freeShippingThreshold ? 0 : 25))}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full bg-[#1C1917] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="w-full bg-white border border-[#E7E5E4] text-[#1C1917] py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#F5F5F3] transition-colors cursor-pointer"
                >
                  View Full Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
