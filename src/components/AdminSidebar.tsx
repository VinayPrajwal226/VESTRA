import React from 'react';
import {
  ExternalLink,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AdminSidebarProps {
  currentTab: 'overview' | 'products' | 'categories' | 'orders' | 'media';
  setTab: (tab: 'overview' | 'products' | 'categories' | 'orders' | 'media') => void;
  navigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, setTab, navigate }) => {
  const { user, logout } = useAuth();

  const links: {
    id: 'overview' | 'products' | 'categories' | 'orders' | 'media';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Product Catalog', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'orders', label: 'Order Dispatch', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'media', label: 'Media & Uploads', icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#1C1917] text-[#D6D3D1] p-6 flex flex-col justify-between shrink-0 min-h-screen">
      <div className="space-y-8">
        {/* Brand Lockup */}
        <div className="border-b border-[#292524] pb-5">
          <span className="text-xl font-serif tracking-[0.25em] text-white block uppercase">
            VESTRA
          </span>
          <span className="text-[11px] tracking-wider uppercase text-[#A8A29E] block mt-0.5">
            Atelier Management System
          </span>
        </div>

        {/* User Card */}
        <div className="bg-[#292524] p-3 border border-[#3E3A37] text-xs">
          <span className="text-[#A8A29E] text-[10px] uppercase tracking-wider block">
            Authorized Administrator
          </span>
          <span className="font-semibold text-white truncate block">{user?.name || 'Helena Vance'}</span>
          <span className="text-[#A8A29E] text-[11px] truncate block">{user?.email || 'admin@vestra.com'}</span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setTab(link.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors cursor-pointer text-left ${
                currentTab === link.id
                  ? 'bg-white text-[#1C1917]'
                  : 'text-[#A8A29E] hover:text-white hover:bg-[#292524]'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-[#292524] pt-6 space-y-2 text-xs">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 text-[#A8A29E] hover:text-white py-2 px-1 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Exit to Storefront</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 text-rose-400 hover:text-rose-300 py-2 px-1 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
