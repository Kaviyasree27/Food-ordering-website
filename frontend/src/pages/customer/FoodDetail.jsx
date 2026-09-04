import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiClock, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { foodAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

const FoodDetail = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    foodAPI
      .getById(id)
      .then((res) => setFood(res.data.data))
      .catch(() => setFood(null))
      .finally(() => setLoading(false));
    setQty(1);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-2xl font-display font-semibold mb-4">Dish not found</p>
        <Link to="/menu" className="text-ember font-semibold hover:underline">Back to menu</Link>
      </div>
    );
  }

  const finalPrice = food.discountPrice > 0 ? food.discountPrice : food.price;

  return (
    <div className="container-page py-10">
      <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-ember mb-6">
        <FiArrowLeft /> Back to menu
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-sm2 overflow-hidden bg-paper">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center justify-center w-5 h-5 border ${
                food.isVeg ? 'border-leaf' : 'border-ember'
              } bg-white`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? 'bg-leaf' : 'bg-ember'}`} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              {food.category?.name}
            </span>
          </div>

          <h1 className="text-4xl font-display font-semibold mb-3">{food.name}</h1>

          <div className="flex items-center gap-4 text-sm text-ink/60 mb-4">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <FiStar className="text-mustard fill-mustard" /> {food.rating?.average?.toFixed(1)}
              <span className="text-ink/40 font-normal">({food.rating?.count} ratings)</span>
            </span>
            <span className="flex items-center gap-1">
              <FiClock /> {food.prepTime} min
            </span>
          </div>

          <p className="text-ink/60 leading-relaxed mb-6">{food.description}</p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-display font-semibold">₹{finalPrice}</span>
            {food.discountPrice > 0 && (
              <span className="text-lg text-ink/40 line-through">₹{food.price}</span>
            )}
          </div>

          {food.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {food.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-paper rounded-full text-xs font-medium text-ink/60">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {food.isAvailable ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-ink text-white rounded-sm2 px-3 py-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="hover:text-ember">
                  <FiMinus />
                </button>
                <span className="font-semibold w-6 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="hover:text-ember">
                  <FiPlus />
                </button>
              </div>
              <button onClick={() => addToCart(food, qty)} className="btn-primary flex-1">
                Add to Cart · ₹{finalPrice * qty}
              </button>
            </div>
          ) : (
            <div className="bg-paper text-ink/50 text-center py-3 rounded-sm2 font-semibold">
              Currently Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
