import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowUpRight, DollarSign, Eye, Package, ShoppingBag, Users } from 'lucide-react';
import { api } from '../api/client.ts';
import { Order } from '../types/index.ts';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  setTab: (tab: 'overview' | 'products' | 'categories' | 'orders' | 'media') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, setTab }) => {
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    lowStockCount: number;
    recentOrders: Order[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getDashboardStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, nextStatus);
      // Refresh stats
      const res = await api.getDashboardStats();
      if (res.success && res.stats) setStats(res.stats);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-[#E7E5E4] w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#E7E5E4]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-10">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E5E4] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block mb-1">
            Executive Summary
          </span>
          <h1 className="text-3xl font-serif text-[#1C1917]">
            Atelier Dispatch & Metrics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab('products')}
            className="bg-[#1C1917] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            + Add New Garment
          </button>
        </div>
      </div>

      {/* KPI Cards (Clean single-elevation depth with tabular numbers per frontend-design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-[#E7E5E4] space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#78716C] block">
            Gross Remittance
          </span>
          <div className="text-3xl font-serif text-[#1C1917] tabular-nums">
            ${stats?.totalRevenue.toLocaleString() || 0}
          </div>
          <span className="text-[11px] text-emerald-700 block font-medium">
            +18.4% vs previous cycle
          </span>
        </div>

        <div className="bg-white p-6 border border-[#E7E5E4] space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#78716C] block">
            Reservations Placed
          </span>
          <div className="text-3xl font-serif text-[#1C1917] tabular-nums">
            {stats?.totalOrders || 0}
          </div>
          <span className="text-[11px] text-[#78716C] block">
            White-glove insured orders
          </span>
        </div>

        <div className="bg-white p-6 border border-[#E7E5E4] space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#78716C] block">
            Active Garment Archive
          </span>
          <div className="text-3xl font-serif text-[#1C1917] tabular-nums">
            {stats?.totalProducts || 0}
          </div>
          <span className="text-[11px] text-[#78716C] block">
            Across 5 curated disciplines
          </span>
        </div>

        <div className="bg-white p-6 border border-[#E7E5E4] space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#78716C] block">
            Stock Critical Threshold
          </span>
          <div className="text-3xl font-serif text-amber-800 tabular-nums">
            {stats?.lowStockCount || 0}
          </div>
          <span className="text-[11px] text-[#78716C] block">
            Pieces below 5 inventory units
          </span>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white border border-[#E7E5E4] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
          <div>
            <h2 className="text-lg font-serif text-[#1C1917]">
              Recent Acquisition Orders
            </h2>
            <span className="text-xs text-[#78716C]">
              Review fulfillment dispatch and manage courier manifests
            </span>
          </div>

          <button
            onClick={() => setTab('orders')}
            className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#78716C] cursor-pointer"
          >
            All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E7E5E4] text-[#78716C] uppercase tracking-wider bg-[#FAFAF9]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4">Garments</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Tender</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4]">
              {stats?.recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#1C1917]">
                    #{ord.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#1C1917] block">{ord.customerName}</span>
                    <span className="text-[#78716C]">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4">
                    {ord.items.length} {ord.items.length === 1 ? 'piece' : 'pieces'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1C1917] tabular-nums">
                    ${ord.total}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] text-[#78716C]">
                    {ord.paymentMethod}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className="bg-white border border-[#E7E5E4] py-1 px-2 text-[11px] font-medium text-[#1C1917] focus:outline-none focus:border-[#1C1917] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/order-success/${ord.id}`)}
                      className="p-1 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                      title="Inspect Manifest"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
