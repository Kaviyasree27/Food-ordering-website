import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

import { foodAPI } from '../../services/api';
import FoodCard from '../../components/FoodCard';

const ITEMS_PER_PAGE = 12;

// ============================================================
// CATEGORY ORDER
// ============================================================

const CATEGORY_ORDER = {
  Desserts: 1,
  Pizza: 2,
  Burgers: 3,
  Indian: 4,
  Chinese: 5,
  Beverages: 6,
  Salads: 7,
};

// ============================================================
// EXACT FOOD ORDER
// ============================================================

const FOOD_ORDER = {
  // Desserts FIRST
  'Chocolate Brownie': 1,
  Cheesecake: 2,
  'Chocolate Cake': 3,
  Tiramisu: 4,
  Pancakes: 5,
  Waffles: 6,
  'Ice Cream Sundae': 7,
  'Fruit Tart': 8,

  // Pizza
  'Margherita Pizza': 9,
  'Farmhouse Pizza': 10,
  'Pepperoni Pizza': 11,
  'Veggie Supreme Pizza': 12,
  'BBQ Chicken Pizza': 13,
  'Four Cheese Pizza': 14,
  'Mushroom Pizza': 15,
  'Chicken Tikka Pizza': 16,

  // Burgers
  'Classic Chicken Burger': 17,
  'Cheese Burger': 18,
  'Double Beef Burger': 19,
  'Crispy Chicken Burger': 20,
  'BBQ Chicken Burger': 21,
  'Mushroom Swiss Burger': 22,
  'Veggie Burger': 23,

  // Indian
  'Butter Chicken': 24,
  'Tandoori Chicken': 25,
  'Paneer Tikka': 26,
  'Jeera Rice': 27,

  // Chinese
  'Chicken Fried Rice': 28,
  'Chicken Dumplings': 29,
  'Veg Fried Rice': 30,
  'Chicken Noodles': 31,

  // Beverages
  'Iced Coffee': 32,
  'Fresh Orange Juice': 33,
  'Mango Smoothie': 34,
  'Lemon Mojito': 35,
  'Strawberry Smoothie': 36,
  'Masala Chai': 37,

  // Salads
  'Pasta Salad': 38,
  'Caesar Salad': 39,
};

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    isVeg: searchParams.get('isVeg') || '',
    sort: searchParams.get('sort') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await foodAPI.getCategories();
        setCategories(res.data.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // ============================================================
  // LOAD FOODS
  // ============================================================

  const loadFoods = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        limit: 100,
        page: 1,
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.isVeg) {
        params.isVeg = filters.isVeg;
      }

      const res = await foodAPI.getAll(params);

      let allFoods = [...(res.data.data || [])];

      // ========================================================
      // DEFAULT / RECOMMENDED ORDER
      // ========================================================

      if (!filters.sort) {
        allFoods.sort((a, b) => {
          const orderA = FOOD_ORDER[a.name] ?? 999;
          const orderB = FOOD_ORDER[b.name] ?? 999;

          return orderA - orderB;
        });
      }

      // ========================================================
      // PRICE LOW TO HIGH
      // ========================================================

      if (filters.sort === 'price_asc') {
        allFoods.sort((a, b) => {
          const priceA =
            a.discountPrice > 0
              ? a.discountPrice
              : a.price;

          const priceB =
            b.discountPrice > 0
              ? b.discountPrice
              : b.price;

          return priceA - priceB;
        });
      }

      // ========================================================
      // PRICE HIGH TO LOW
      // ========================================================

      if (filters.sort === 'price_desc') {
        allFoods.sort((a, b) => {
          const priceA =
            a.discountPrice > 0
              ? a.discountPrice
              : a.price;

          const priceB =
            b.discountPrice > 0
              ? b.discountPrice
              : b.price;

          return priceB - priceA;
        });
      }

      // ========================================================
      // HIGHEST RATED
      // ========================================================

      if (filters.sort === 'rating') {
        allFoods.sort((a, b) => {
          return (
            (b.rating?.average || 0) -
            (a.rating?.average || 0)
          );
        });
      }

      // ========================================================
      // MOST POPULAR
      // ========================================================

      if (filters.sort === 'popular') {
        allFoods.sort((a, b) => {
          return (
            (b.rating?.count || 0) -
            (a.rating?.count || 0)
          );
        });
      }

      // ========================================================
      // PAGINATION
      // ========================================================

      const total = allFoods.length;

      const pages = Math.max(
        1,
        Math.ceil(total / ITEMS_PER_PAGE)
      );

      const currentPage = Math.min(
        Math.max(filters.page, 1),
        pages
      );

      const startIndex =
        (currentPage - 1) * ITEMS_PER_PAGE;

      const pageFoods = allFoods.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      setFoods(pageFoods);

      setPagination({
        page: currentPage,
        pages,
        total,
      });
    } catch (error) {
      console.error('Error loading foods:', error);

      setFoods([]);

      setPagination({
        page: 1,
        pages: 1,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ============================================================
  // FILTER CHANGE
  // ============================================================

  useEffect(() => {
    loadFoods();

    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });

    setSearchParams(params, {
      replace: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // ============================================================
  // UPDATE FILTER
  // ============================================================

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === 'page' ? value : 1,
    }));
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      isVeg: '',
      sort: '',
      page: 1,
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.isVeg,
    filters.sort,
  ].filter(Boolean).length;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="container-page py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-semibold mb-2">
          Explore the menu
        </h1>

        <p className="text-ink/50">
          {pagination.total} dishes crafted fresh, just for you
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
          />

          <input
            className="input-field pl-10"
            placeholder="Search for dishes, cuisines..."
            value={filters.search}
            onChange={(e) =>
              updateFilter('search', e.target.value)
            }
          />
        </div>

        <button
          onClick={() =>
            setShowFilters((current) => !current)
          }
          className="btn-outline flex items-center gap-2 justify-center relative"
        >
          <FiFilter />

          Filters

          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-ember text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="card p-5 mb-8 grid sm:grid-cols-3 gap-4">

          {/* CATEGORY */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
              Category
            </label>

            <select
              className="input-field"
              value={filters.category}
              onChange={(e) =>
                updateFilter(
                  'category',
                  e.target.value
                )
              }
            >
              <option value="">
                All Categories
              </option>

              {categories
                .slice()
                .sort((a, b) => {
                  const orderA =
                    CATEGORY_ORDER[a.name] ?? 999;

                  const orderB =
                    CATEGORY_ORDER[b.name] ?? 999;

                  return orderA - orderB;
                })
                .map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* DIET */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
              Diet
            </label>

            <select
              className="input-field"
              value={filters.isVeg}
              onChange={(e) =>
                updateFilter(
                  'isVeg',
                  e.target.value
                )
              }
            >
              <option value="">
                All
              </option>

              <option value="true">
                Vegetarian
              </option>

              <option value="false">
                Non-Vegetarian
              </option>
            </select>
          </div>

          {/* SORT */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
              Sort by
            </label>

            <select
              className="input-field"
              value={filters.sort}
              onChange={(e) =>
                updateFilter(
                  'sort',
                  e.target.value
                )
              }
            >
              <option value="">
                Recommended
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="popular">
                Most Popular
              </option>
            </select>
          </div>

          {/* CLEAR */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="sm:col-span-3 flex items-center justify-center gap-1 text-sm text-ember font-semibold"
            >
              <FiX size={14} />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* CONTENT */}
      {loading ? (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] bg-paper rounded-sm2 animate-pulse"
            />
          ))}
        </div>

      ) : foods.length === 0 ? (

        <div className="text-center py-24">
          <p className="text-2xl font-display font-semibold mb-2">
            No dishes found
          </p>

          <p className="text-ink/50">
            Try adjusting your search or filters
          </p>
        </div>

      ) : (

        <>
          {/* FOOD GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {foods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
              />
            ))}

          </div>

          {/* PAGINATION */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">

              {[...Array(pagination.pages)].map(
                (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() =>
                        updateFilter(
                          'page',
                          pageNumber
                        )
                      }
                      className={`w-9 h-9 rounded-sm2 text-sm font-semibold transition-colors ${
                        pagination.page === pageNumber
                          ? 'bg-ink text-white'
                          : 'bg-white border border-line hover:border-ink'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;