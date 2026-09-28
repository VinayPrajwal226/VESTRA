import React, { useEffect, useState } from 'react';
import { Check, Download, Package, Printer, ShieldCheck, Truck } from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { Order } from '../types/index.ts';

interface OrderSuccessPageProps {
  orderId: string;
  navigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, navigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.getOrder(orderId);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    const content = `
========================================
VESTRA ATELIER — OFFICIAL RECEIPT / INVOICE
========================================
Order Reference: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer: ${order.customerName} (${order.customerEmail})
Status: ${order.status}
Tracking ID: ${order.trackingNumber || 'Pending Courier Scan'}

SHIPPING DESTINATION:
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
${order.shippingAddress.country}
Phone: ${order.shippingAddress.phone}

ITEMIZED SPECIFICATION:
${order.items.map((i) => `- ${i.title} [Size: ${i.selectedSize}, Tone: ${i.selectedColor}] x ${i.quantity} = $${i.price * i.quantity}`).join('\n')}

Subtotal: $${order.subtotal}
Discount: -$${order.discount}
Courier Fee: $${order.shippingFee}
Taxes (8%): $${order.tax}
TOTAL PAID: $${order.total}

Tender: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})
Thank you for acquiring from VESTRA.
========================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VESTRA-Invoice-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 animate-pulse">
        <div className="h-8 bg-[#E7E5E4] w-64 mx-auto" />
        <div className="h-4 bg-[#E7E5E4] w-96 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#1C1917]">Order Record Not Found</h1>
        <button
          onClick={() => navigate('/shop')}
          className="bg-[#1C1917] text-white py-2.5 px-6 text-xs uppercase tracking-wider font-semibold cursor-pointer"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  const steps = [
    { label: 'Order Confirmed', completed: true, active: false },
    { label: 'Atelier Processing', completed: order.status !== 'Pending', active: order.status === 'Processing' },
    { label: 'Courier Transit', completed: order.status === 'Shipped' || order.status === 'Delivered', active: order.status === 'Shipped' },
    { label: 'Handover Completed', completed: order.status === 'Delivered', active: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Post-Order Hero Banner */}
      <div className="bg-[#F5F5F3] border border-[#E7E5E4] p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-[#1C1917] text-white rounded-full flex items-center justify-center mx-auto">
          <Check className="w-6 h-6" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block">
          Reservation Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917]">
          Order #{order.id} Confirmed — Preparing Shipment
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] max-w-lg mx-auto">
          A receipt has been dispatched to <strong>{order.customerEmail}</strong>. Our atelier artisans are currently conducting final inspection and hand-steaming your garments.
        </p>

        <div className="pt-2 text-xs text-[#78716C]">
          Estimated Courier Arrival: <strong>3–5 Business Days</strong> · Tracking: <strong>{order.trackingNumber || 'Pending Manifest'}</strong>
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <div className="bg-white border border-[#E7E5E4] p-6 sm:p-8 space-y-6">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-[#1C1917]">
          Fulfillment Timeline
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((st, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <div
                className={`h-1.5 w-full rounded-full transition-colors ${
                  st.completed
                    ? 'bg-[#1C1917]'
                    : st.active
                    ? 'bg-[#78716C]'
                    : 'bg-[#E7E5E4]'
                }`}
              />
              <span
                className={`text-xs ${
                  st.completed
                    ? 'font-semibold text-[#1C1917]'
                    : 'text-[#78716C]'
                }`}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Receipt Breakdown */}
      <div className="bg-white border border-[#E7E5E4] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E5E4] gap-4">
          <div>
            <h2 className="text-lg font-serif text-[#1C1917]">Itemized Specification</h2>
            <span className="text-xs text-[#78716C]">
              Tender: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'} · Status: {order.paymentStatus}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] hover:bg-[#F5F5F3] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Invoice</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] hover:bg-[#F5F5F3] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#E7E5E4]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex gap-4 items-center">
              <div className="w-16 h-20 bg-[#F5F5F3] border border-[#E7E5E4] overflow-hidden shrink-0">
                <ImageFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-xs">
                <h4 className="font-semibold text-[#1C1917]">{item.title}</h4>
                <p className="text-[#78716C] mt-0.5">
                  Size: {item.selectedSize} · Tone: {item.selectedColor} · Qty: {item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium text-[#1C1917] tabular-nums">
                ${item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Cost summary table */}
        <div className="pt-4 border-t border-[#E7E5E4] space-y-2 text-xs text-[#78716C] max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#1C1917] tabular-nums">${order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Promotional Courtesy</span>
              <span className="tabular-nums">-${order.discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Courier Delivery</span>
            <span>{order.shippingFee === 0 ? 'Complimentary' : `$${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Duties</span>
            <span className="tabular-nums">${order.tax}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-[#1C1917] pt-2 border-t border-[#E7E5E4]">
            <span>Total Remittance</span>
            <span className="font-serif text-lg tabular-nums">${order.total}</span>
          </div>
        </div>
      </div>

      {/* Destination Card */}
      <div className="bg-[#F5F5F3] border border-[#E7E5E4] p-6 text-xs text-[#57534E] space-y-1">
        <span className="font-semibold uppercase tracking-wider text-[#1C1917] block mb-2">
          Dispatch Address
        </span>
        <p>{order.customerName}</p>
        <p>{order.shippingAddress.street}</p>
        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
        <p>{order.shippingAddress.country} · {order.shippingAddress.phone}</p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/shop')}
          className="bg-[#1C1917] text-white py-3.5 px-8 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
        >
          Return to Collection
        </button>
      </div>
    </div>
  );
};
