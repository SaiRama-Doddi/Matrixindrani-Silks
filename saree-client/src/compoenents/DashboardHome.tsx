import { Package, FolderTree, TrendingUp, Star, RefreshCw } from 'lucide-react';

interface DashboardHomeProps {
  stats: {
    totalSarees: number;
    totalCategories: number;
    totalRevenue: number;
    avgRating: number;
  };
  onRefresh: () => void;
}

export function DashboardHome({ stats, onRefresh }: DashboardHomeProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's your store summary</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{stats.totalSarees}</p>
          <p className="text-slate-600 text-sm">Total Sarees</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <FolderTree className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{stats.totalCategories}</p>
          <p className="text-slate-600 text-sm">Categories</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-slate-600 text-sm">Inventory Value</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {stats.avgRating > 0 ? stats.avgRating : 'N/A'}
          </p>
          <p className="text-slate-600 text-sm">Average Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
              <p className="font-semibold text-slate-900">Add New Saree</p>
              <p className="text-sm text-slate-600">Create a new saree product</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
              <p className="font-semibold text-slate-900">Add Category</p>
              <p className="text-sm text-slate-600">Create a new category</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
              <p className="font-semibold text-slate-900">View All Products</p>
              <p className="text-sm text-slate-600">Browse your inventory</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
