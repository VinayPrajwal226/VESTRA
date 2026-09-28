import React, { useEffect, useState } from 'react';
import { Check, Download, Eye, Filter, Package, Truck, X } from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { Order } from '../types/index.ts';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status edit
  const [newStatus, setNewStatus] = useState<Order['status']>('Processing');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAllOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrderModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setTrackingNumber(ord.trackingNumber || '');
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await api.updateOrderStatus(selectedOrder.id, newStatus, trackingNumber);
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? res.order : o)));
        setSelectedOrder(res.order);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E5E4] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block mb-1">
            Logistics & Fulfillment
          </span>
          <h1 className="text-3xl font-serif text-[#1C1917]">Dispatch Manifests</h1>
          <p className="text-xs text-[#78716C] mt-1">
            Assign courier track IDs, update fulfillment statuses, and verify client deliveries.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-white p-1 border border-[#E7E5E4]">
          {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#1C1917] text-white'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E7E5E4] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[#78716C] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Order ID</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Pieces</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Tracking Code</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4]">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#FAFAF9] transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-[#1C1917]">
                  #{ord.id}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-[#1C1917] block">{ord.customerName}</span>
                  <span className="text-[#78716C]">{ord.customerEmail}</span>
                </td>
                <td className="py-3 px-4 tabular-nums">
                  {ord.items.length}
                </td>
                <td className="py-3 px-4 font-semibold text-[#1C1917] tabular-nums">
                  ${ord.total}
                </td>
                <td className="py-3 px-4">
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
                </td>
                <td className="py-3 px-4 font-mono text-[#78716C]">
                  {ord.trackingNumber || 'Unassigned'}
                </td>
                <td className="py-3 px-4 text-[#78716C]">
                  {new Date(ord.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => openOrderModal(ord)}
                    className="p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    title="View & Edit"
                  >
                    <Eye className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail & Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative bg-[#FAFAF9] border border-[#E7E5E4] max-w-2xl w-full p-6 sm:p-8 z-10 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#78716C] block">
                  Manifest #{selectedOrder.id}
                </span>
                <h2 className="text-xl font-serif text-[#1C1917]">
                  Order Fulfillment Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Destination & Contact info */}
            <div className="bg-white p-4 border border-[#E7E5E4] space-y-1 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#1C1917] block mb-1">
                Client Destination:
              </span>
              <p><strong>Name:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
              <p><strong>Country:</strong> {selectedOrder.shippingAddress.country} · <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#44403C] block">
                Reserved Pieces:
              </span>
              <div className="divide-y divide-[#E7E5E4] border border-[#E7E5E4] bg-white max-h-40 overflow-y-auto">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#1C1917]">{it.title}</span>
                      <span className="text-[#78716C] ml-2">
                        Size: {it.selectedSize} · Tone: {it.selectedColor} · Qty: {it.quantity}
                      </span>
                    </div>
                    <span className="font-semibold tabular-nums text-[#1C1917]">
                      ${it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleStatusUpdate} className="bg-white p-4 border border-[#E7E5E4] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Courier Tracking Code
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. VSTR-98234-NY"
                    className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                >
                  {updating ? 'Updating...' : 'Update Manifest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
