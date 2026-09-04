import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { foodAPI } from '../../services/api';
import FoodCard from '../../components/FoodCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [foodsRes, catRes] = await Promise.all([
          foodAPI.getAll({ featured: true, limit: 8 }),
          foodAPI.getCategories(),
        ]);
        setFeatured(foodsRes.data.data);
        setCategories(catRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-cream">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-ember font-semibold tracking-wide text-sm mb-4">Delivered in 30 minutes or less</p>
            <h1 className="text-5xl md:text-6xl font-display font-semibold leading-[1.05] mb-6">
              Real food,
              <br />
              made for right now.
            </h1>
            <p className="text-cream/60 text-lg max-w-md mb-8 leading-relaxed">
              From sizzling street food to comforting classics — order from your favorite local
              kitchens and get it hot at your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                Order Now <FiArrowRight />
              </Link>
              <Link to="/menu" className="inline-flex items-center gap-2 text-cream/80 hover:text-white transition-colors font-semibold">
                Browse Menu
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
                className="rounded-sm2 h-64 w-full object-cover translate-y-8"
                alt="Burger"
              />
              <img
                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"
                className="rounded-sm2 h-64 w-full object-cover"
                alt="Pizza"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-line bg-white">
        <div className="container-page py-6 flex flex-wrap justify-around gap-6 text-sm font-medium text-ink/70">
          <span className="flex items-center gap-2"><FiClock className="text-ember" /> Avg. 28 min delivery</span>
          <span className="flex items-center gap-2"><FiShield className="text-ember" /> 100% quality checked</span>
          <span className="flex items-center gap-2"><FiTruck className="text-ember" /> Free delivery above ₹500</span>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-page py-16">
          <h2 className="text-3xl font-display font-semibold mb-8">Browse by category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/menu?category=${cat._id}`}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-line rounded-sm2 hover:border-ember hover:shadow-card transition-all"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured foods */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-display font-semibold">Popular right now</h2>
          <Link to="/menu" className="text-sm font-semibold text-ember hover:underline flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-paper rounded-sm2 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
