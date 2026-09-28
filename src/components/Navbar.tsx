import React, { useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, isAdmin } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Outerwear', path: '/category/outerwear' },
    { label: 'Tailoring', path: '/category/tailoring' },
    { label: 'Knitwear', path: '/category/knitwear' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E7E5E4] transition-all">
      {/* Top Bar Announcement / Trust Line */}
      <div className="bg-[#1C1917] text-[#FAFAF9] text-[11px] py-1.5 px-4 text-center tracking-wider uppercase font-medium">
        Complimentary global courier shipping on all orders over $300
      </div>

      {/* Strict 3-Zone Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            navigate('/');
            setMobileMenuOpen(false);
          }}
          className="text-2xl sm:text-3xl font-serif tracking-[0.22em] text-[#1C1917] uppercase hover:opacity-80 transition-opacity cursor-pointer shrink-0"
        >
          VESTRA
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#44403C]">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-[#1C1917] font-semibold' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1C1917]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary functional actions */}
        <div className="flex items-center gap-4 sm:gap-6 text-[#1C1917]">
          {/* Search Trigger */}
          <button
            onClick={() => navigate('/search')}
            aria-label="Search collection"
            className="p-1.5 text-[#44403C] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => navigate('/wishlist')}
            aria-label="Saved pieces"
            className="p-1.5 text-[#44403C] hover:text-[#1C1917] transition-colors relative cursor-pointer"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1C1917] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={openCart}
            aria-label="Shopping bag"
            className="p-1.5 text-[#44403C] hover:text-[#1C1917] transition-colors relative cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1C1917] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {itemCount}
              </span>
            )}
          </button>

          {/* Account / Admin Link */}
          <button
            onClick={() => {
              if (isAdmin) {
                navigate('/admin');
              } else if (user) {
                navigate('/account');
              } else {
                navigate('/login');
              }
            }}
            aria-label="Account or Dashboard"
            className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#44403C] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <UserIcon className="w-5 h-5" strokeWidth={1.5} />
            <span className="max-w-[100px] truncate">
              {isAdmin ? 'Atelier CMS' : user ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#44403C] hover:text-[#1C1917] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E5E4] bg-[#FAFAF9] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-lg font-serif text-[#1C1917] hover:text-[#78716C] transition-colors py-1 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/contact');
                setMobileMenuOpen(false);
              }}
              className="text-left text-lg font-serif text-[#1C1917] hover:text-[#78716C] transition-colors py-1 cursor-pointer"
            >
              Concierge & Atelier
            </button>
          </nav>

          <div className="pt-4 border-t border-[#E7E5E4] flex flex-col space-y-3 text-sm">
            <button
              onClick={() => {
                if (isAdmin) navigate('/admin');
                else if (user) navigate('/account');
                else navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 font-medium text-[#1C1917] flex items-center justify-between cursor-pointer"
            >
              <span>{isAdmin ? 'Admin Dashboard' : user ? `Account: ${user.name}` : 'Sign In / Register'}</span>
              <span className="text-xs uppercase text-[#78716C]">→</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
