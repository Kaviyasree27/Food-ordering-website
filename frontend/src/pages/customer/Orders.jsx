import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import { orderAPI } from '../../services/api';

const statusStyles = {
  pending: 'bg-mustard/15 text-mustard',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-mustard/15 text-mustard',
  out_for_delivery: 'bg-ember/10 text-ember',
  delivered: 'bg-leaf/10 text-leaf',
  cancelled: 'bg-red-100 text-red-600',
};

const statusLabel = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI
      .getMy()
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <FiPackage className="mx-auto text-ink/20 mb-4" size={64} />
        <h1 className="text-2xl font-display font-semibold mb-2">No orders yet</h1>
        <p className="text-ink/50 mb-6">Your order history will show up here</p>
        <Link to="/menu" className="btn-primary inline-flex">Start Ordering</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-display font-semibold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="card p-5 flex items-center justify-between gap-4 hover:border-ember transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="hidden sm:flex w-14 h-14 rounded-sm2 bg-paper items-center justify-center shrink-0">
                <FiPackage className="text-ink/40" size={24} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold truncate">#{order.orderNumber}</p>
                <p className="text-sm text-ink/50 truncate">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}>
                {statusLabel(order.status)}
              </span>
              <span className="font-display font-semibold hidden sm:block">₹{order.totalPrice.toFixed(0)}</span>
              <FiChevronRight className="text-ink/30" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
