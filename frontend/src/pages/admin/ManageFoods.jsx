import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import { foodAPI } from '../../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  image: '',
  category: '',
  isVeg: true,
  isAvailable: true,
  isFeatured: false,
  prepTime: 20,
  spiceLevel: 'none',
};

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [foodsRes, catRes] = await Promise.all([
        foodAPI.getAll({ limit: 100, search: search || undefined }),
        foodAPI.getCategories(),
      ]);
      setFoods(foodsRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(loadData, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || '' });
    setShowModal(true);
  };

  const openEdit = (food) => {
    setEditingId(food._id);
    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      discountPrice: food.discountPrice || '',
      image: food.image,
      category: food.category?._id || food.category,
      isVeg: food.isVeg,
      isAvailable: food.isAvailable,
      isFeatured: food.isFeatured,
      prepTime: food.prepTime,
      spiceLevel: food.spiceLevel || 'none',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        prepTime: Number(form.prepTime),
      };
      if (editingId) {
        await foodAPI.update(editingId, payload);
        toast.success('Food item updated');
      } else {
        await foodAPI.create(payload);
        toast.success('Food item created');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save food item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item permanently?')) return;
    try {
      await foodAPI.delete(id);
      toast.success('Food item deleted');
      loadData();
    } catch (err) {
      toast.error('Failed to delete food item');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Manage Foods</h1>
          <p className="text-ink/50">Add, edit, and organize your menu items</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Food Item
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          className="input-field pl-10"
          placeholder="Search food items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-ink/60 uppercase text-xs tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Item</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-ink/40">Loading...</td></tr>
            ) : foods.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-ink/40">No food items found</td></tr>
            ) : (
              foods.map((food) => (
                <tr key={food._id} className="border-t border-line hover:bg-paper/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={food.image} alt={food.name} className="w-10 h-10 rounded-sm2 object-cover" />
                      <span className="font-medium">{food.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{food.category?.name}</td>
                  <td className="px-5 py-3 font-medium">
                    ₹{food.discountPrice > 0 ? food.discountPrice : food.price}
                    {food.discountPrice > 0 && <span className="text-ink/40 line-through ml-1 text-xs">₹{food.price}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${food.isAvailable ? 'bg-leaf/10 text-leaf' : 'bg-red-100 text-red-600'}`}>
                      {food.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(food)} className="p-2 hover:text-ember"><FiEdit2 size={15} /></button>
                    <button onClick={() => handleDelete(food._id)} className="p-2 hover:text-ember"><FiTrash2 size={15} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-sm2 max-w-2xl w-full p-6 my-8 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-display font-semibold">{editingId ? 'Edit Food Item' : 'Add Food Item'}</h2>
              <button onClick={() => setShowModal(false)}><FiX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea required rows={2} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Image URL</label>
                <input required className="input-field" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Price (₹)</label>
                <input required type="number" min="0" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Discount Price (optional)</label>
                <input type="number" min="0" className="input-field" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select required className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Prep Time (min)</label>
                <input type="number" min="1" className="input-field" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-5 pt-1">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} /> Vegetarian
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Available
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
                </label>
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editingId ? 'Update Item' : 'Create Item'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFoods;
