import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { foodAPI } from '../../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '🍽️' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    foodAPI.getCategories().then((res) => setCategories(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await foodAPI.createCategory(form);
      toast.success('Category created');
      setShowModal(false);
      setForm({ name: '', icon: '🍽️' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Food items using it may be affected.')) return;
    try {
      await foodAPI.deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Categories</h1>
          <p className="text-ink/50">Organize your menu into categories</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-ink/40">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-semibold">{cat.name}</span>
              </div>
              <button onClick={() => handleDelete(cat._id)} className="text-ink/30 hover:text-ember">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm2 max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-display font-semibold">Add Category</h2>
              <button onClick={() => setShowModal(false)}><FiX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category Name</label>
                <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Icon (emoji)</label>
                <input className="input-field" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? 'Saving...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
