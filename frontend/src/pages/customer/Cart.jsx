import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <FiShoppingBag className="mx-auto text-ink/20 mb-4" size={64} />
        <h1 className="text-2xl font-display font-semibold mb-2">Your cart is empty</h1>
        <p className="text-ink/50 mb-6">Looks like you haven't added anything yet</p>
        <Link to="/menu" className="btn-primary inline-flex">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-display font-semibold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.food} className="card p-4 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm2 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold truncate">{item.name}</h3>
                <p className="text-ink/50 text-sm">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-2 bg-paper rounded-sm2 px-1">
                <button
                  onClick={() => updateQuantity(item.food, item.quantity - 1)}
                  className="p-1.5 hover:text-ember"
                >
                  <FiMinus size={14} />
                </button>
                <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.food, item.quantity + 1)}
                  className="p-1.5 hover:text-ember"
                >
                  <FiPlus size={14} />
                </button>
              </div>
              <p className="font-display font-semibold w-16 text-right shrink-0">
                ₹{item.price * item.quantity}
              </p>
              <button
                onClick={() => removeFromCart(item.food)}
                className="text-ink/30 hover:text-ember shrink-0"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-display font-semibold text-xl mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span className="text-ink font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Delivery Fee</span>
              <span className="text-ink font-medium">
                {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Tax (5%)</span>
              <span className="text-ink font-medium">₹{tax.toFixed(2)}</span>
            </div>
            {subtotal < 500 && (
              <p className="text-xs text-leaf bg-leaf/10 px-3 py-2 rounded-sm2">
                Add ₹{(500 - subtotal).toFixed(0)} more for free delivery!
              </p>
            )}
            <div className="border-t border-line pt-3 flex justify-between font-display font-semibold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            Proceed to Checkout <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
