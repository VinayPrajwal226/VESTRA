import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Lock, ShieldCheck, Truck } from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { items, subtotal, discount, shippingFee, promoCode, clearCart } = useCart();

  // Shipping Form
  const [formData, setFormData] = useState({
    name: user?.name || 'Julian Sterling',
    email: user?.email || 'customer@vestra.com',
    phone: user?.phone || '+1 (555) 234-5678',
    street: user?.address?.street || '128 Mercer Street, Apt 4B',
    city: user?.address?.city || 'New York',
    state: user?.address?.state || 'NY',
    postalCode: user?.address?.postalCode || '10012',
    country: user?.address?.country || 'United States',
  });

  // Shipping & Payment Options
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cod' | 'apple_pay'>('credit_card');

  // Simulated Card Data
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '884',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const expressCost = shippingMethod === 'express' ? 35 : 0;
  const currentShippingCost = shippingFee + expressCost;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, subtotal - discount + currentShippingCost + tax);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        items,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        customerName: formData.name,
        customerEmail: formData.email,
        paymentMethod,
        promoCode: promoCode || undefined,
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        navigate(`/order-success/${res.order.id}`);
      } else {
        setErrorMessage(res.message || 'Order processing failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Shopping Bag</span>
        </button>
      </div>

      <div className="border-b border-[#E7E5E4] pb-4 flex items-center justify-between">
        <h1 className="text-3xl font-serif text-[#1C1917]">Secure Atelier Checkout</h1>
        <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
          <Lock className="w-3.5 h-3.5 text-[#1C1917]" />
          <span>256-Bit Encrypted Protocol</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Customer, Shipping & Payment forms */}
        <div className="lg:col-span-7 space-y-10">
          {/* Section 1: Customer Contact */}
          <div className="space-y-4">
            <h2 className="text-base font-serif text-[#1C1917] border-b border-[#E7E5E4] pb-2 flex items-center justify-between">
              <span>01. Client Identification</span>
              {!user && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs text-[#78716C] hover:text-[#1C1917] underline font-sans"
                >
                  Already registered? Sign in
                </button>
              )}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Email for Confirmation
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Courier Contact Telephone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Destination */}
          <div className="space-y-4">
            <h2 className="text-base font-serif text-[#1C1917] border-b border-[#E7E5E4] pb-2">
              02. Destination Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Street Address & Apartment
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Shipping Method */}
          <div className="space-y-4">
            <h2 className="text-base font-serif text-[#1C1917] border-b border-[#E7E5E4] pb-2">
              03. Dispatch Courier Protocol
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`p-4 border cursor-pointer flex flex-col justify-between transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-[#1C1917] bg-[#F5F5F3]'
                    : 'border-[#E7E5E4] bg-white hover:border-[#A8A29E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Standard Insured Courier
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-[#1C1917]">
                    {subtotal >= 300 ? 'Complimentary' : '$25'}
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C] mt-2">
                  Estimated delivery in 3–5 business days. White-glove handling with signature required.
                </p>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`p-4 border cursor-pointer flex flex-col justify-between transition-all ${
                  shippingMethod === 'express'
                    ? 'border-[#1C1917] bg-[#F5F5F3]'
                    : 'border-[#E7E5E4] bg-white hover:border-[#A8A29E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Next-Flight Express
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-[#1C1917]">
                    +$35
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C] mt-2">
                  Estimated delivery in 1–2 business days. Direct priority transit from atelier.
                </p>
              </label>
            </div>
          </div>

          {/* Section 4: Payment Terms & Method */}
          <div className="space-y-4">
            <h2 className="text-base font-serif text-[#1C1917] border-b border-[#E7E5E4] pb-2">
              04. Settlement Tender
            </h2>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border cursor-pointer transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#44403C] border-[#E7E5E4]'
                }`}
              >
                Credit / Debit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#44403C] border-[#E7E5E4]'
                }`}
              >
                Cash on Delivery (COD)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border cursor-pointer transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#44403C] border-[#E7E5E4]'
                }`}
              >
                Apple Pay / 1-Touch
              </button>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'credit_card' && (
              <div className="bg-[#F5F5F3] p-5 border border-[#E7E5E4] space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs font-mono tabular-nums focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardData.cardExpiry}
                      onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                      className="w-full bg-white border border-[#E7E5E4] p-2 text-xs font-mono tabular-nums focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1">
                      Security Code (CVC)
                    </label>
                    <input
                      type="text"
                      value={cardData.cardCvc}
                      onChange={(e) => setCardData({ ...cardData, cardCvc: e.target.value })}
                      className="w-full bg-white border border-[#E7E5E4] p-2 text-xs font-mono tabular-nums focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-[#F5F5F3] p-5 border border-[#E7E5E4] space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] block">
                  Cash on Delivery Protocol
                </span>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  You will remit the exact balance of <strong className="text-[#1C1917] tabular-nums">${grandTotal}</strong> in cash upon physical handover by the courier concierge. Please ensure a representative is present at your designated address.
                </p>
                <div className="pt-2 text-[11px] text-[#78716C]">
                  ✓ Free delivery threshold: $300 (Subtotal: ${subtotal})
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="bg-[#F5F5F3] p-5 border border-[#E7E5E4] text-center space-y-2">
                <p className="text-xs text-[#44403C]">
                  Biometric one-touch authorization will execute when you place the order.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 bg-[#F5F5F3] border border-[#E7E5E4] p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-serif text-[#1C1917] border-b border-[#E7E5E4] pb-3">
            Garment Reservation ({items.length})
          </h2>

          {/* Mini Item List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-[#E7E5E4] pr-1">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                className="py-3 flex gap-3 items-center"
              >
                <div className="w-12 h-16 bg-white border border-[#E7E5E4] overflow-hidden shrink-0">
                  <ImageFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <h4 className="font-medium text-[#1C1917] truncate">{item.title}</h4>
                  <p className="text-[#78716C]">
                    {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#1C1917] tabular-nums">
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs text-[#78716C] border-t border-[#E7E5E4] pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1C1917] tabular-nums">${subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Courtesy</span>
                <span className="tabular-nums">-${discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Courier Delivery</span>
              <span>{currentShippingCost === 0 ? 'Complimentary' : `$${currentShippingCost}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Duties (8%)</span>
              <span className="tabular-nums">${tax}</span>
            </div>

            <div className="flex justify-between text-base font-semibold text-[#1C1917] pt-4 border-t border-[#E7E5E4]">
              <span>Final Settlement</span>
              <span className="font-serif text-xl tabular-nums">${grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full bg-[#1C1917] text-white py-4 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {submitting ? (
              <span>Authorizing Transaction...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Place Order & Authorize (${grandTotal})</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-[#78716C]">
            By placing your order, you accept the VESTRA Atelier Terms of Concierge and complimentary 30-day exchange policy.
          </p>
        </div>
      </form>
    </div>
  );
};
