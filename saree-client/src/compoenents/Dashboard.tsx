import { useState, useEffect } from 'react';
import {
  Package,
  FolderTree,
  TrendingUp,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../config/context/AuthContext';
import { Sarees } from '../pages/SareeList';
import CategoryList from '../pages/CategoryList';
import { DashboardHome } from './DashboardHome';

type View = 'dashboard' | 'sarees' | 'categories';

export function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSarees: 0,
    totalCategories: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
  const { user, logout } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [sareesRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/sarees`),
        fetch(`${API_URL}/api/categories`),
      ]);

      const sareesData = await sareesRes.json();
      const categoriesData = await categoriesRes.json();

      const sarees = sareesData.sarees || [];
      const totalRevenue = sarees.reduce(
        (sum: number, s: any) => sum + (s.offerPrice || s.price),
        0
      );
      const avgRating =
        sarees.length > 0
          ? sarees.reduce((sum: number, s: any) => sum + (s.rating || 0), 0) /
            sarees.filter((s: any) => s.rating).length
          : 0;

      setStats({
        totalSarees: sarees.length,
        totalCategories: categoriesData.length || 0,
        totalRevenue,
        avgRating: parseFloat(avgRating.toFixed(1)),
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sarees', label: 'Sarees', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 mt-20 relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-24 left-4 z-40 bg-slate-900 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-72 bg-white border-r border-slate-200 flex flex-col z-30 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-2.5 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Saree Admin</h1>
              <p className="text-xs text-slate-500">Management Panel</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-4 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
              <Package className="w-5 h-5 text-blue-600 mb-1" />
              <p className="text-2xl font-bold text-slate-900">{stats.totalSarees}</p>
              <p className="text-xs text-slate-600">Sarees</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl">
              <FolderTree className="w-5 h-5 text-green-600 mb-1" />
              <p className="text-2xl font-bold text-slate-900">{stats.totalCategories}</p>
              <p className="text-xs text-slate-600">Categories</p>
            </div>
          </div>
          <div className="mt-3 bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-xl">
            <TrendingUp className="w-5 h-5 text-amber-600 mb-1" />
            <p className="text-lg font-bold text-slate-900 truncate">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-600">Total Value</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setSidebarOpen(false); // close sidebar on mobile
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-xl p-3 mb-3">
            <p className="text-xs text-slate-500 mb-1">Logged in as</p>
            <p className="font-semibold text-slate-900">{user?.fullName}</p>
            <p className="text-xs text-slate-600">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-0 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        {currentView === 'dashboard' && <DashboardHome stats={stats} onRefresh={fetchStats} />}
        {currentView === 'sarees' && <Sarees />}
        {currentView === 'categories' && <CategoryList />}
      </main>
    </div>
  );
}
