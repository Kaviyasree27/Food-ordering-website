import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { foodAPI } from '../../services/api';
import FoodCard from '../../components/FoodCard';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    isVeg: searchParams.get('isVeg') || '',
    sort: searchParams.get('sort') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    foodAPI.getCategories().then((res) => setCategories(res.data.data));
  }, []);

  const loadFoods = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 12, page: filters.page };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.isVeg) params.isVeg = filters.isVeg;
      if (filters.sort) params.sort = filters.sort;

      const res = await foodAPI.getAll(params);
      setFoods(res.data.data);
      setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFoods();
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', isVeg: '', sort: '', page: 1 });
  };

  const activeFilterCount = [filters.category, filters.isVeg, filters.sort].filter(Boolean).length;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-semibold mb-2">Explore the menu</h1>
        <p className="text-ink/50">{pagination.total} dishes crafted fresh, just for you</p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            className="input-field pl-10"
            placeholder="Search for dishes, cuisines..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-outline flex items-center gap-2 justify-center relative"
        >
          <FiFilter /> Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-ember text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="card p-5 mb-8 grid sm:grid-cols-3 gap-4 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Category</label>
            <select
              className="input-field"
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Diet</label>
            <select
              className="input-field"
              value={filters.isVeg}
              onChange={(e) => updateFilter('isVeg', e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Vegetarian</option>
              <option value="false">Non-Vegetarian</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Sort by</label>
            <select
              className="input-field"
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="sm:col-span-3 flex items-center justify-center gap-1 text-sm text-ember font-semibold"
            >
              <FiX size={14} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-paper rounded-sm2 animate-pulse" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-2xl font-display font-semibold mb-2">No dishes found</p>
          <p className="text-ink/50">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilter('page', i + 1)}
                  className={`w-9 h-9 rounded-sm2 text-sm font-semibold transition-colors ${
                    pagination.page === i + 1
                      ? 'bg-ink text-white'
                      : 'bg-white border border-line hover:border-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;
