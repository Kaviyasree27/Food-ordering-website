import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const VegDot = ({ isVeg }) => (
  <span
    className={`inline-flex items-center justify-center w-4 h-4 border ${
      isVeg ? 'border-leaf' : 'border-ember'
    } bg-white`}
    title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
  >
    <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-leaf' : 'bg-ember'}`} />
  </span>
);

const FoodCard = ({ food }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);

  const cartItem = items.find((i) => i.food === food._id);
  const finalPrice = food.discountPrice > 0 ? food.discountPrice : food.price;
  const hasDiscount = food.discountPrice > 0 && food.discountPrice < food.price;
  const discountPct = hasDiscount ? Math.round(((food.price - food.discountPrice) / food.price) * 100) : 0;

  return (
    <div className="group card overflow-hidden flex flex-col h-full transition-shadow duration-200 hover:shadow-lift">
      <Link to={`/food/${food._id}`} className="relative block aspect-[4/3] overflow-hidden bg-paper">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-paper" />}
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute top-3 left-3">
          <VegDot isVeg={food.isVeg} />
        </div>
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-ember text-white text-[11px] font-bold px-2 py-1 rounded-sm2">
            {discountPct}% OFF
          </div>
        )}
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm tracking-wide">Currently Unavailable</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/food/${food._id}`} className="min-w-0">
            <h3 className="font-display font-semibold text-lg text-ink leading-snug truncate">
              {food.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-xs font-semibold text-ink/70 shrink-0 mt-1">
            <FiStar className="text-mustard fill-mustard" size={13} />
            {food.rating?.average?.toFixed ? food.rating.average.toFixed(1) : food.rating?.average}
          </div>
        </div>

        <p className="text-sm text-ink/55 mt-1 line-clamp-2 flex-1">{food.description}</p>

        <div className="flex items-center gap-3 mt-3 text-xs text-ink/50">
          <span className="flex items-center gap-1">
            <FiClock size={12} /> {food.prepTime} min
          </span>
          {food.category?.name && (
            <span className="px-2 py-0.5 bg-paper rounded-full">{food.category.name}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-semibold text-lg text-ink">₹{finalPrice}</span>
            {hasDiscount && (
              <span className="text-xs text-ink/40 line-through">₹{food.price}</span>
            )}
          </div>

          {food.isAvailable && (
            cartItem ? (
              <div className="flex items-center gap-2 bg-ink text-white rounded-sm2 px-1">
                <button
                  onClick={() => updateQuantity(food._id, cartItem.quantity - 1)}
                  className="p-1.5 hover:text-ember transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={13} />
                </button>
                <span className="text-sm font-semibold w-4 text-center">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(food._id, cartItem.quantity + 1)}
                  className="p-1.5 hover:text-ember transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(food)}
                className="text-sm font-semibold border border-ink px-3 py-1.5 rounded-sm2 hover:bg-ink hover:text-white transition-colors duration-150"
              >
                Add
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
