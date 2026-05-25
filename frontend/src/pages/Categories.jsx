import { useState, useEffect } from 'react';
import { categoryAPI } from '../api';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Tag, Palette, FolderPlus, X, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import CustomSelect from '../components/CustomSelect';

const PRESET_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'];
const PRESET_ICONS = ['💼', '📺', '🪙', '🍔', '✈️', '🏠', '🚗', '🛍️', '🎓', '🏥', '🎮', '❤️'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💼');
  const [color, setColor] = useState('#6366f1');
  const [type, setType] = useState('EXPENSE');
  const [parentId, setParentId] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (err) {
      toast.error('Using offline fallback categories.');
      setCategories([
        { id: 'c1', name: 'Salary', type: 'INCOME', color: '#10b981', icon: '💼', description: 'Business income salary' },
        { id: 'c2', name: 'Subscriptions', type: 'EXPENSE', color: '#ef4444', icon: '📺', description: 'Monthly subscriptions' },
        { id: 'c3', name: 'Crypto Investments', type: 'INVESTMENT', color: '#6366f1', icon: '🪙', description: 'Crypto portfolio assets' },
        { id: 'c4', name: 'Gold Pawning', type: 'PAWNING', color: '#f59e0b', icon: '🪙', description: 'Gold pawn records' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setIcon('💼');
    setColor('#6366f1');
    setType('EXPENSE');
    setParentId('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon || '💼');
    setColor(cat.color || '#6366f1');
    setType(cat.type);
    setParentId(cat.parentId || '');
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error('Category Name is required');

    const payload = {
      name,
      icon,
      color,
      type,
      parentId: parentId || null,
      description
    };

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, payload);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(payload);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error('Simulation: saved offline.');
      if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...payload } : c));
      } else {
        setCategories([...categories, { ...payload, id: Date.now().toString() }]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await categoryAPI.delete(deleteConfirmId);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category online. Removed offline.');
      setCategories(categories.filter(c => c.id !== deleteConfirmId));
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Ledger Categories</h1>
          <p className="text-slate-400 text-sm mt-1">Dynamically create, organize, and color-code your financial structures.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {/* Grid of Dynamic Categories */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 skeleton" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <Layers className="w-12 h-12 text-slate-500 mb-3" />
          <h3 className="text-lg font-bold text-white">No custom categories</h3>
          <p className="text-slate-400 text-sm mt-1">Start by creating custom folders to structure your financial operating system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
              {/* Colored side indicator */}
              <div className="absolute top-0 left-0 w-[4px] h-full" style={{ backgroundColor: cat.color || '#6366f1' }} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${cat.color || '#6366f1'}20` }}>
                    {'📁'}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {cat.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-slate-400 text-xs line-clamp-2">{cat.description || 'No description provided'}</p>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/5 opacity-100">
                <button onClick={() => openEditModal(cat)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-rose-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card bg-[var(--color-surface-800)] w-full max-w-lg p-6 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Crypto Investments"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category Type</label>
                    <CustomSelect
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      options={[
                        { value: "EXPENSE", label: "Expense" },
                        { value: "INCOME", label: "Income" },
                        { value: "SAVINGS", label: "Savings" },
                        { value: "INVESTMENT", label: "Investment" },
                        { value: "LOAN", label: "Loan" },
                        { value: "ASSET", label: "Asset" },
                        { value: "LIABILITY", label: "Liability" },
                        { value: "PAWNING", label: "Pawning" },
                        { value: "SUBSCRIPTION", label: "Subscription" },
                        { value: "BILL", label: "Bill" },
                        { value: "DEBT", label: "Debt" },
                        { value: "CUSTOM", label: "Custom" }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Parent Category (Optional)</label>
                    <CustomSelect
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      options={[
                        { value: "", label: "No Parent" },
                        ...categories.filter(c => c.id !== editingCategory?.id).map(cat => ({ value: cat.id, label: cat.name }))
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Custom Color</label>
                  <div className="flex gap-2.5 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>



                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary of this group..."
                    rows="2"
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-ghost py-2.5 px-5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-6"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={executeDelete}
        title="Delete Category"
        message="Delete category? Records in this category will become unassigned."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
