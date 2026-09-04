import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.getUsers().then((res) => setUsers(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleUser(id);
      toast.success('Customer status updated');
      load();
    } catch {
      toast.error('Failed to update customer status');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-1">Customers</h1>
      <p className="text-ink/50 mb-6">{users.length} registered customers</p>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-paper text-ink/60 uppercase text-xs tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Phone</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-ink/40">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-ink/40">No customers yet</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t border-line hover:bg-paper/50">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-ink/60">{u.email}</td>
                  <td className="px-5 py-3 text-ink/60">{u.phone || '—'}</td>
                  <td className="px-5 py-3 text-ink/50">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-leaf/10 text-leaf' : 'bg-red-100 text-red-600'}`}>
                      {u.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleToggle(u._id)}
                      className="text-xs font-semibold text-ember border border-ember px-3 py-1.5 rounded-sm2 hover:bg-ember hover:text-white transition-colors"
                    >
                      {u.isActive ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
