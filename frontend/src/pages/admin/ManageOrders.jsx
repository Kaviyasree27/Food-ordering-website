import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEye, FiX } from 'react-icons/fi';
import { orderAPI } from '../../services/api';

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const statusStyles = {
  pending: 'bg-mustard/15 text-mustard',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-mustard/15 text-mustard',
  out_for_delivery: 'bg-ember/10 text-ember',
  delivered: 'bg-leaf/10 text-leaf',
  cancelled: 'bg-red-100 text-red-600',
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await orderAPI.getAll(params);
      setOrders(res.data.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      toast.success('Order status updated');
      load();
      if (selected?._id === id) setSelected((s) => ({ ...s, status }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Orders</h1>
          <p className="text-ink/50">Track and manage all customer orders</p>
        </div>
        <select className="input-field !w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-paper text-ink/60 uppercase text-xs tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Order #</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Items</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-ink/40">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-ink/40">No orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t border-line hover:bg-paper/50">
                  <td className="px-5 py-3 font-medium">#{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-xs text-ink/50">{order.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{order.items.length} items</td>
                  <td className="px-5 py-3 font-semibold">₹{order.totalPrice.toFixed(0)}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1.5 rounded-sm2 border-0 ${statusStyles[order.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-ink/50 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelected(order)} className="p-2 hover:text-ember">
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-sm2 max-w-lg w-full p-6 my-8 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-display font-semibold">Order #{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)}><FiX size={22} /></button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold">{selected.user?.name}</p>
              <p className="text-xs text-ink/50">{selected.user?.email} · {selected.user?.phone}</p>
            </div>

            <div className="space-y-2 mb-4">
              {selected.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.quantity} × {item.name}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-3 mb-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{selected.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-1">Delivery Address</p>
              <p className="text-sm text-ink/60">
                {selected.deliveryAddress.street}, {selected.deliveryAddress.city} {selected.deliveryAddress.zipCode}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Update Status</label>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                className="input-field"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
