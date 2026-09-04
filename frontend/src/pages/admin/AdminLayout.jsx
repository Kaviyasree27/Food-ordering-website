import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiLogOut,
  FiExternalLink,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/foods', label: 'Manage Foods', icon: FiBox },
  { to: '/admin/categories', label: 'Categories', icon: FiTag },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
  { to: '/admin/users', label: 'Customers', icon: FiUsers },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-64 bg-ink text-cream flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-display font-semibold">
            Taste<span className="text-ember">Hub</span>
          </h1>
          <p className="text-xs text-cream/40 mt-1 tracking-wide uppercase">Admin Console</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-sm2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ember text-white' : 'text-cream/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-sm2 text-sm font-medium text-cream/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FiExternalLink size={18} /> View Store
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-sm2 text-sm font-medium text-ember hover:bg-white/10 transition-colors"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-line h-16 flex items-center justify-end px-8 gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold leading-tight">{user?.name}</p>
            <p className="text-xs text-ink/50">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-ember text-white flex items-center justify-center font-bold text-sm uppercase">
            {user?.name?.[0]}
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
