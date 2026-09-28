import React, { useEffect, useState } from 'react';
import { Check, Download, Eye, LogOut, Package, ShieldCheck, User as UserIcon } from 'lucide-react';
import { api } from '../api/client.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Order } from '../types/index.ts';

interface AccountPageProps {
  navigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { user, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit Profile States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'United States');
  const [profileSaved, setProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.getMyOrders();
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadInvoice = (order: Order) => {
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
Taxes: $${order.tax}
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-[#E7E5E4] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block mb-1">
            Client Dossier
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917]">
            {user?.name || 'Collector Profile'}
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            {user?.email} · Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#E7E5E4] bg-white text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] hover:border-[#1C1917] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Acquisition Order History */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
            <h2 className="text-lg font-serif text-[#1C1917] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#1C1917]" />
              <span>Acquisition History ({orders.length})</span>
            </h2>
          </div>

          {loadingOrders ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-[#E7E5E4]" />
              <div className="h-24 bg-[#E7E5E4]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 border border-[#E7E5E4] bg-white text-center space-y-3">
              <p className="font-serif text-lg text-[#1C1917]">No orders recorded yet</p>
              <p className="text-xs text-[#78716C]">
                Explore our catalog to place your initial bespoke reservation.
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#1C1917] text-white py-2 px-6 text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-[#E7E5E4] p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E7E5E4] pb-3 gap-2">
                    <div>
                      <span className="text-xs font-semibold text-[#1C1917]">Order #{ord.id}</span>
                      <span className="text-xs text-[#78716C] ml-2">
                        {new Date(ord.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] uppercase tracking-wider px-2 py-0.5 border ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : ord.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-[#E7E5E4]">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-[#1C1917]">{item.title}</span>
                          <span className="text-[#78716C]">
                            ({item.selectedSize} · {item.selectedColor} · Qty {item.quantity})
                          </span>
                        </div>
                        <span className="tabular-nums font-semibold text-[#1C1917]">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[#E7E5E4] text-xs gap-3">
                    <div className="text-[#78716C]">
                      Total: <strong className="text-[#1C1917] tabular-nums font-serif text-sm">${ord.total}</strong> · Tracking: {ord.trackingNumber || 'Processing'}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/order-success/${ord.id}`)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-[#E7E5E4] hover:bg-[#F5F5F3] transition-colors cursor-pointer text-[#1C1917]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(ord)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-[#E7E5E4] hover:bg-[#F5F5F3] transition-colors cursor-pointer text-[#1C1917]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Address Book & Profile Modification */}
        <div className="lg:col-span-5 bg-[#F5F5F3] border border-[#E7E5E4] p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-serif text-[#1C1917] border-b border-[#E7E5E4] pb-3">
            Concierge Address & Details
          </h2>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Dossier updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Primary Shipping Address
              </label>
              <input
                type="text"
                value={street}
                placeholder="Street and residence..."
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  State / Postal
                </label>
                <input
                  type="text"
                  value={`${state} ${postalCode}`.trim()}
                  onChange={(e) => {
                    const parts = e.target.value.split(' ');
                    setState(parts[0] || '');
                    setPostalCode(parts.slice(1).join(' ') || '');
                  }}
                  className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#1C1917] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Dossier'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
