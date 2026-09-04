import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiMapPin, FiPhone } from 'react-icons/fi';
import { orderAPI } from '../../services/api';

const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const stepLabel = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    orderAPI
      .getById(id)
      .then((res) => setOrder(res.data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderAPI.cancel(id);
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-2xl font-display font-semibold mb-4">Order not found</p>
        <Link to="/orders" className="text-ember font-semibold hover:underline">Back to orders</Link>
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="container-page py-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-display font-semibold">Order #{order.orderNumber}</h1>
        {['pending', 'confirmed'].includes(order.status) && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-sm font-semibold text-ember border border-ember px-4 py-2 rounded-sm2 hover:bg-ember hover:text-white transition-colors"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>
      <p className="text-ink/50 mb-8">
        Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
      </p>

      {/* Status tracker */}
      <div className="card p-6 mb-6">
        {isCancelled ? (
          <div className="flex items-center gap-3 text-red-600 font-semibold">
            <FiX size={22} /> This order was cancelled
            {order.cancelReason && <span className="text-ink/50 font-normal">— {order.cancelReason}</span>}
          </div>
        ) : (
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-line -z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-ember transition-all duration-500 -z-0"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center z-10 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx <= currentStepIndex ? 'bg-ember text-white' : 'bg-white border-2 border-line text-ink/30'
                  }`}
                >
                  {idx <= currentStepIndex ? <FiCheck size={14} /> : idx + 1}
                </div>
                <span className={`text-xs mt-2 text-center font-medium ${idx <= currentStepIndex ? 'text-ink' : 'text-ink/40'}`}>
                  {stepLabel[step]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-sm2" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-ink/50">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-line mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span><span>₹{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Delivery Fee</span><span>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Tax</span><span>₹{order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-line pt-2 flex justify-between font-display font-semibold text-lg">
              <span>Total</span><span>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="card p-6 h-fit space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><FiMapPin className="text-ember" /> Delivery Address</h3>
            <p className="text-sm text-ink/60 leading-relaxed">
              {order.deliveryAddress.street}, {order.deliveryAddress.city}
              {order.deliveryAddress.state ? `, ${order.deliveryAddress.state}` : ''}{' '}
              {order.deliveryAddress.zipCode}
            </p>
          </div>
          {order.deliveryAddress.phone && (
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><FiPhone className="text-ember" /> Contact</h3>
              <p className="text-sm text-ink/60">{order.deliveryAddress.phone}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm mb-2">Payment Method</h3>
            <p className="text-sm text-ink/60 uppercase">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
