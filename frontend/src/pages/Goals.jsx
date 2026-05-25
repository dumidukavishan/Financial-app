import { useState, useEffect } from 'react';
import { goalAPI, categoryAPI } from '../api';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Calendar, Target, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import CustomSelect from '../components/CustomSelect';

const GOAL_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const GOAL_ICONS = ['🎮', '✈️', '🏠', '🚗', '🎓', '🪙', '💍', '💻', '📈'];

// Format as Sri Lankan Rupees
const formatLKR = (val) => {
  const num = parseFloat(val) || 0;
  return 'Rs. ' + new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('🎮');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const [goalsRes, catRes] = await Promise.all([
        goalAPI.getAll(),
        categoryAPI.getAll()
      ]);
      setGoals(goalsRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      toast.error('Using offline fallback goals.');
      setCategories([
        { id: 'c1', name: 'Salary', type: 'INCOME', color: '#10b981', icon: '💼' }
      ]);
      setGoals([
        {
          id: 'g1',
          title: 'Gaming Setup Savings',
          description: 'High-end desktop gaming PC build target',
          targetAmount: 2000,
          currentAmount: 1200,
          progressPercentage: 60,
          deadline: '2026-12-31',
          color: '#06b6d4',
          icon: '🎮',
          status: 'IN_PROGRESS'
        },
        {
          id: 'g2',
          title: 'Travel Fund - Europe',
          description: 'Savings for summer vacation trip to Italy',
          targetAmount: 5000,
          currentAmount: 1500,
          progressPercentage: 30,
          deadline: '2027-06-30',
          color: '#8b5cf6',
          icon: '✈️',
          status: 'IN_PROGRESS'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setCurrentAmount('0');
    setDeadline('');
    setColor('#6366f1');
    setIcon('🎮');
    setCategoryId('');
    setStatus('IN_PROGRESS');
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setTargetAmount(goal.targetAmount);
    setCurrentAmount(goal.currentAmount || '0');
    setDeadline(goal.deadline || '');
    setColor(goal.color || '#6366f1');
    setIcon(goal.icon || '🎮');
    setCategoryId(goal.categoryId || '');
    setStatus(goal.status || 'IN_PROGRESS');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return toast.error('Title and Target Amount are required');

    const payload = {
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline: deadline || null,
      color,
      icon,
      categoryId: categoryId || null,
      status
    };

    try {
      if (editingGoal) {
        await goalAPI.update(editingGoal.id, payload);
        toast.success('Goal updated successfully');
      } else {
        await goalAPI.create(payload);
        toast.success('Goal created successfully');
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      toast.error('Simulation: saved offline.');
      const progressPercentage = Math.round((payload.currentAmount / payload.targetAmount) * 100);
      const newGoal = { ...payload, id: editingGoal ? editingGoal.id : Date.now().toString(), progressPercentage };
      if (editingGoal) {
        setGoals(goals.map(g => g.id === editingGoal.id ? newGoal : g));
      } else {
        setGoals([...goals, newGoal]);
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
      await goalAPI.delete(deleteConfirmId);
      toast.success('Goal deleted');
      fetchGoals();
    } catch (err) {
      toast.error('Simulation: Removed offline.');
      setGoals(goals.filter(g => g.id !== deleteConfirmId));
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Savings & Target Goals</h1>
          <p className="text-slate-400 text-sm mt-1">Set, track, and hit your financial objectives.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-5 h-5" /> Create Goal
        </button>
      </div>

      {/* Goals Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 skeleton" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <Target className="w-12 h-12 text-slate-500 mb-3" />
          <h3 className="text-lg font-bold text-white">No active goals</h3>
          <p className="text-slate-400 text-sm mt-1">Ready to start planning your dream wedding, vacation, or new tech?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.max(0, goal.progressPercentage || 0));
            return (
              <div key={goal.id} className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[4px]" style={{ backgroundColor: goal.color || '#6366f1' }} />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${goal.color || '#6366f1'}20` }}>
                      {goal.icon || '🎯'}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                      {goal.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{goal.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4">{goal.description || 'No description provided'}</p>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Progress</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-[var(--color-surface-700)] rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${goal.color || '#6366f1'}, #06b6d4)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Saved: {formatLKR(goal.currentAmount)}</span>
                    <span>Target: {formatLKR(goal.targetAmount)}</span>
                  </div>
                  {goal.deadline && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target Date: {goal.deadline}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(goal)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(goal.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-rose-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
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
                  {editingGoal ? 'Edit Financial Goal' : 'Create Financial Goal'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Wedding Budget"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Amount (Rs. LKR)</label>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="5000"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Saved (Rs. LKR)</label>
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      placeholder="1500"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Date (Deadline)</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                    <CustomSelect
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      options={[
                        { value: "IN_PROGRESS", label: "In Progress" },
                        { value: "COMPLETED", label: "Completed" },
                        { value: "PAUSED", label: "Paused" },
                        { value: "CANCELLED", label: "Cancelled" }
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Choose Goal Color</label>
                  <div className="flex gap-2.5 flex-wrap">
                    {GOAL_COLORS.map(c => (
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
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Goal Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this target..."
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
                    {editingGoal ? 'Save Changes' : 'Create Goal'}
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
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
