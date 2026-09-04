import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [address, setAddress] = useState({
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    zipCode: defaultAddr?.zipCode || '',
    phone: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');

  if (items.length === 0) {
    return <Navigate to="/menu" replace />;
  }

  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city) {
      toast.error('Please fill in your delivery address');
      return;
    }
    setPlacing(true);
    try {
      const res = await orderAPI.create({
        items,
        deliveryAddress: address,
        paymentMethod,
        notes,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-display font-semibold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
              <FiTruck className="text-ember" /> Delivery Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Street Address</label>
                <input
                  required
                  className="input-field"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <input
                  required
                  className="input-field"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">State</label>
                <input
                  className="input-field"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Zip Code</label>
                <input
                  className="input-field"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <input
                  className="input-field"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
              <FiCreditCard className="text-ember" /> Payment Method
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'cod', label: 'Cash on Delivery' },
                { id: 'card', label: 'Credit/Debit Card' },
                { id: 'upi', label: 'UPI' },
                { id: 'wallet', label: 'Wallet' },
              ].map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-sm2 border text-sm font-semibold text-center transition-colors ${
                    paymentMethod === method.id
                      ? 'border-ember bg-ember/5 text-ember'
                      : 'border-line hover:border-ink/30'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <label className="block text-sm font-medium mb-1.5">Order Notes (optional)</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Any special instructions for delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-display font-semibold text-xl mb-5">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
            {items.map((item) => (
              <div key={item.food} className="flex justify-between text-sm">
                <span className="text-ink/70">{item.quantity} × {item.name}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-line pt-2 flex justify-between font-display font-semibold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button type="submit" disabled={placing} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            {placing ? 'Placing order...' : <>Place Order <FiCheck /></>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
