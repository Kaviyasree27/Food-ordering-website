import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiMapPin, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', street: '', city: '', state: '', zipCode: '' });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateMe(form);
      updateUser(res.data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.addAddress(newAddr);
      setAddresses(res.data.data);
      setShowAddrForm(false);
      setNewAddr({ label: 'Home', street: '', city: '', state: '', zipCode: '' });
      toast.success('Address added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await authAPI.deleteAddress(id);
      setAddresses(res.data.data);
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div className="container-page py-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-display font-semibold mb-8">My Profile</h1>

      <div className="card p-6 mb-6">
        <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
          <FiUser className="text-ember" /> Personal Information
        </h2>
        <form onSubmit={handleSaveProfile} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input className="input-field bg-paper" value={user?.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-xl flex items-center gap-2">
            <FiMapPin className="text-ember" /> Saved Addresses
          </h2>
          <button onClick={() => setShowAddrForm((s) => !s)} className="text-sm font-semibold text-ember flex items-center gap-1">
            <FiPlus /> Add New
          </button>
        </div>

        {showAddrForm && (
          <form onSubmit={handleAddAddress} className="grid sm:grid-cols-2 gap-3 mb-5 p-4 bg-paper rounded-sm2">
            <input
              className="input-field"
              placeholder="Label (e.g. Home, Office)"
              value={newAddr.label}
              onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Street Address"
              required
              value={newAddr.street}
              onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="City"
              required
              value={newAddr.city}
              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="State"
              value={newAddr.state}
              onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Zip Code"
              value={newAddr.zipCode}
              onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
            />
            <button type="submit" className="btn-primary sm:col-span-2">Save Address</button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-ink/50 text-sm">No saved addresses yet</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id} className="flex items-start justify-between p-4 border border-line rounded-sm2">
                <div>
                  <p className="font-semibold text-sm mb-1">{addr.label}</p>
                  <p className="text-sm text-ink/60">
                    {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                </div>
                <button onClick={() => handleDeleteAddress(addr._id)} className="text-ink/30 hover:text-ember">
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
