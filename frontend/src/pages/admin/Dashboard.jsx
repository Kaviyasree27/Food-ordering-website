import { useEffect, useState } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiClock } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { adminAPI } from '../../services/api';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-sm2 flex items-center justify-center ${accent}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-display font-semibold leading-tight">{value}</p>
      <p className="text-sm text-ink/50">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getStats()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = stats.salesTrend.map((d) => ({
    date: new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-1">Dashboard</h1>
      <p className="text-ink/50 mb-8">Overview of your restaurant's performance</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toFixed(0)}`} accent="bg-ember" />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats.totalOrders} accent="bg-ink" />
        <StatCard icon={FiClock} label="Pending Orders" value={stats.pendingOrders} accent="bg-mustard" />
        <StatCard icon={FiUsers} label="Total Customers" value={stats.totalUsers} accent="bg-leaf" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Revenue — Last 7 Days</h2>
          {chartData.length === 0 ? (
            <p className="text-ink/40 text-sm py-16 text-center">No sales data for the past week yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E1D8" />
                <XAxis dataKey="date" stroke="#171412" fontSize={12} />
                <YAxis stroke="#171412" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: 6, border: '1px solid #E7E1D8', fontSize: 13 }}
                  formatter={(value, name) => [name === 'revenue' ? `₹${value}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#E8491D" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <FiPackage className="text-ember" /> Top Selling Items
          </h2>
          {stats.topFoods.length === 0 ? (
            <p className="text-ink/40 text-sm py-8 text-center">No sales yet</p>
          ) : (
            <div className="space-y-4">
              {stats.topFoods.map((food, idx) => (
                <div key={food._id || idx} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-paper flex items-center justify-center text-xs font-bold text-ink/60">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{food.name}</p>
                    <p className="text-xs text-ink/50">{food.totalSold} sold</p>
                  </div>
                  <p className="text-sm font-semibold">₹{food.revenue.toFixed(0)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="font-display font-semibold text-lg mb-4">Orders by Status</h2>
        <div className="flex flex-wrap gap-4">
          {stats.statusCounts.map((s) => (
            <div key={s._id} className="px-4 py-3 bg-paper rounded-sm2 flex items-center gap-3">
              <span className="text-2xl font-display font-semibold">{s.count}</span>
              <span className="text-sm text-ink/60 capitalize">{s._id.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
