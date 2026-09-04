import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX, FiUser, FiLogOut, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/orders', label: 'My Orders' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ink text-cream">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-display font-semibold tracking-tight text-cream">
            Taste<span className="text-ember">Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-ember transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 hover:text-ember transition-colors">
            <FiShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-ember text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-ember flex items-center justify-center text-sm font-bold uppercase">
                  {user.name?.[0]}
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-ink rounded-sm2 shadow-lift border border-line overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-ink/50 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-paper transition-colors"
                  >
                    <FiUser /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-paper transition-colors"
                  >
                    <FiClock /> Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ember hover:bg-paper transition-colors"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm">
              Sign In
            </Link>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-ink animate-fade-in">
          <div className="container-page py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium hover:text-ember"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium hover:text-ember">
                  My Profile
                </Link>
                <button onClick={handleLogout} className="py-2.5 text-sm font-medium text-ember text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium hover:text-ember">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
