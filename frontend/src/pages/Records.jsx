import { useState, useEffect } from 'react';
import { recordAPI, categoryAPI, tagAPI } from '../api';
import { toast } from 'react-hot-toast';
import {
  Plus, Search, Edit2, Trash2, Calendar, AlertCircle, RefreshCw, X,
  Filter, Tag, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import CustomSelect from '../components/CustomSelect';

// Format a number as Sri Lankan Rupees: Rs. 1,250,000.00
const formatLKR = (val) => {
  const num = parseFloat(val) || 0;
  return 'Rs. ' + new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export default function Records() {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [recordDates, setRecordDates] = useState([new Date().toISOString().split('T')[0]]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [reminderDate, setReminderDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('MONTHLY');
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsRes, catRes, tagRes] = await Promise.all([
        recordAPI.getAll(0, 100),
        categoryAPI.getAll(),
        tagAPI.getAll()
      ]);
      setRecords(recordsRes.data.content || []);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (err) {
      toast.error('Using offline mock records. Please connect backend DB later.');
      setCategories([
        { id: 'c1', name: 'Salary', type: 'INCOME', color: '#10b981', icon: '💼' },
        { id: 'c2', name: 'Utilities', type: 'EXPENSE', color: '#ef4444', icon: '💡' },
        { id: 'c3', name: 'Investments', type: 'INVESTMENT', color: '#6366f1', icon: '📈' },
        { id: 'c4', name: 'Gold Pawning', type: 'PAWNING', color: '#f59e0b', icon: '🪙' },
      ]);
      setTags([
        { id: 't1', name: 'Personal', color: '#6366f1' },
        { id: 't2', name: 'Urgent', color: '#ef4444' }
      ]);
      setRecords([
        {
          id: '1',
          title: 'Salary Credit',
          amount: 420000,
          type: 'INCOME',
          categoryId: 'c1',
          categoryName: 'Salary',
          categoryColor: '#10b981',
          recordDate: '2026-05-25',
          notes: 'Monthly salary deposit',
          status: 'ACTIVE',
          currency: 'LKR',
          tags: [{ id: 't1', name: 'Personal', color: '#6366f1' }]
        },
        {
          id: '2',
          title: 'Electricity Bill',
          amount: 8500,
          type: 'EXPENSE',
          categoryId: 'c2',
          categoryName: 'Utilities',
          categoryColor: '#ef4444',
          recordDate: '2026-05-24',
          notes: 'CEB monthly bill',
          status: 'ACTIVE',
          currency: 'LKR',
          tags: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingRecord(null);
    setTitle('');
    setAmount('');
    setType('EXPENSE');
    setCategoryId('');
    setRecordDates([new Date().toISOString().split('T')[0]]);
    setNotes('');
    setStatus('ACTIVE');
    setReminderDate('');
    setIsRecurring(false);
    setRecurrencePattern('MONTHLY');
    setSelectedTagIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (rec) => {
    setEditingRecord(rec);
    setTitle(rec.title);
    setAmount(rec.amount);
    setType(rec.type);
    setCategoryId(rec.categoryId || '');
    setRecordDates([rec.recordDate]);
    setNotes(rec.notes || '');
    setStatus(rec.status || 'ACTIVE');
    setReminderDate(rec.reminderDate || '');
    setIsRecurring(rec.recurring || false);
    setRecurrencePattern(rec.recurrencePattern || 'MONTHLY');
    setSelectedTagIds(rec.tags?.map(t => t.id) || []);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || recordDates.length === 0) {
      return toast.error('Please enter Title, Amount and at least one Date');
    }

    try {
      if (editingRecord) {
        const payload = {
          title,
          amount: parseFloat(amount),
          type,
          categoryId: categoryId || null,
          recordDate: recordDates[0],
          notes,
          status,
          reminderDate: reminderDate || null,
          currency: 'LKR',
          recurring: isRecurring,
          recurrencePattern: isRecurring ? recurrencePattern : null,
          tagIds: selectedTagIds
        };
        await recordAPI.update(editingRecord.id, payload);
        toast.success('Record updated successfully');
      } else {
        const promises = recordDates.map(date => {
          const payload = {
            title,
            amount: parseFloat(amount),
            type,
            categoryId: categoryId || null,
            recordDate: date,
            notes,
            status,
            reminderDate: reminderDate || null,
            currency: 'LKR',
            recurring: isRecurring,
            recurrencePattern: isRecurring ? recurrencePattern : null,
            tagIds: selectedTagIds
          };
          return recordAPI.create(payload);
        });
        await Promise.all(promises);
        toast.success(recordDates.length > 1 ? `${recordDates.length} records created successfully` : 'Record created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record(s). Simulating offline update.');
      if (editingRecord) {
        const payload = {
          title,
          amount: parseFloat(amount),
          type,
          categoryId: categoryId || null,
          recordDate: recordDates[0],
          notes,
          status,
          reminderDate: reminderDate || null,
          currency: 'LKR',
          recurring: isRecurring,
          recurrencePattern: isRecurring ? recurrencePattern : null,
          tagIds: selectedTagIds
        };
        setRecords(records.map(r => r.id === editingRecord.id ? { ...r, ...payload, categoryName: categories.find(c => c.id === categoryId)?.name || 'Custom' } : r));
      } else {
        const newRecords = recordDates.map((date, idx) => ({
          title,
          amount: parseFloat(amount),
          type,
          categoryId: categoryId || null,
          recordDate: date,
          notes,
          status,
          reminderDate: reminderDate || null,
          currency: 'LKR',
          recurring: isRecurring,
          recurrencePattern: isRecurring ? recurrencePattern : null,
          tagIds: selectedTagIds,
          id: Date.now().toString() + idx,
          categoryName: categories.find(c => c.id === categoryId)?.name || 'Custom'
        }));
        setRecords([...newRecords, ...records]);
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
      await recordAPI.delete(deleteConfirmId);
      toast.success('Record deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete. Simulating offline deletion.');
      setRecords(records.filter(r => r.id !== deleteConfirmId));
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.notes && rec.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'ALL' || rec.type === filterType;
    const matchesCategory = filterCategory === 'ALL' || rec.categoryId === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Ledger Records</h1>
          <p className="text-slate-400 text-sm mt-1">All transactions in Sri Lankan Rupees (Rs. LKR).</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-5 h-5" /> Add Record
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col gap-4 p-4 glass-card md:flex-row md:items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute top-3.5 left-4" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11 py-2.5 w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <CustomSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-40 min-w-0"
            options={[
              { value: "ALL", label: "All Types" },
              { value: "EXPENSE", label: "Expense" },
              { value: "INCOME", label: "Income" },
              { value: "SAVINGS", label: "Savings" },
              { value: "INVESTMENT", label: "Investment" },
              { value: "PAWNING", label: "Pawning" },
            ]}
          />

          <CustomSelect
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-48 min-w-0"
            options={[
              { value: "ALL", label: "All Categories" },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
          />
        </div>

        <button onClick={fetchData} className="btn-ghost px-4 py-2.5 w-full md:w-auto flex justify-center items-center gap-2" title="Reload Ledger">
          <RefreshCw className="w-4 h-4" />
          <span className="md:hidden text-sm font-medium">Reload Ledger</span>
        </button>
      </div>

      {/* Records Listing */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 skeleton" />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-slate-500 mb-3" />
          <h3 className="text-lg font-bold text-white">No records found</h3>
          <p className="text-slate-400 text-sm mt-1">Try resetting filters or add a new record to get started.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[var(--color-surface-700)] text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">Title / Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount (Rs.)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/5 transition-colors text-slate-200">
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-white text-sm">{rec.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          {rec.categoryName && (
                            <>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rec.categoryColor || '#6366f1' }} />
                              {rec.categoryName}
                            </>
                          )}
                          {rec.notes && <span className="text-[11px] text-slate-500 truncate max-w-[200px]">({rec.notes})</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                        {rec.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      {rec.recordDate}
                    </td>
                    <td className="p-4">
                      <div className={`font-bold text-sm flex items-center ${rec.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {rec.type === 'INCOME' ? '+' : '-'} {formatLKR(rec.amount)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${rec.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(rec)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(rec.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-rose-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-white/5">
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-white text-base">{rec.title}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                      {rec.categoryName && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rec.categoryColor || '#6366f1' }} />
                          {rec.categoryName}
                        </div>
                      )}
                      {rec.notes && <span className="text-[11px] text-slate-500 truncate max-w-[200px]">({rec.notes})</span>}
                    </div>
                  </div>
                  <div className={`font-bold text-base whitespace-nowrap flex items-center ${rec.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {rec.type === 'INCOME' ? '+' : '-'} {formatLKR(rec.amount)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {rec.type}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${rec.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                      {rec.status}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    {rec.recordDate}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/5 mt-1">
                  <button onClick={() => openEditModal(rec)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-indigo-400 transition-all flex-1 flex justify-center items-center gap-2">
                    <Edit2 className="w-4 h-4" /> <span className="text-xs font-medium">Edit</span>
                  </button>
                  <button onClick={() => handleDelete(rec.id)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-rose-400 transition-all flex-1 flex justify-center items-center gap-2">
                    <Trash2 className="w-4 h-4" /> <span className="text-xs font-medium">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Record Modal */}
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
              className="glass-card bg-[var(--color-surface-800)] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingRecord ? 'Edit Financial Record' : 'Add Financial Record'}
                  </h3>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">🇱🇰 All amounts in Sri Lankan Rupees (LKR)</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Record Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Monthly Salary"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Amount <span className="text-emerald-400 normal-case font-normal">(Rs. LKR)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm text-emerald-400 font-bold">Rs.</span>
                    <input
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</label>
                    <CustomSelect
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      options={[
                        { value: "EXPENSE", label: "Expense" },
                        { value: "INCOME", label: "Income" },
                        { value: "SAVINGS", label: "Savings" },
                        { value: "INVESTMENT", label: "Investment" },
                        { value: "LOAN_PAYMENT", label: "Loan Payment" },
                        { value: "PAWNING", label: "Gold Pawning" },
                        { value: "CUSTOM", label: "Custom" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <CustomSelect
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      options={[
                        { value: "", label: "No Category" },
                        ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={!editingRecord ? "col-span-1 sm:col-span-2 md:col-span-1" : ""}>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Record Date(s)</label>
                    <div className="space-y-2">
                      {recordDates.map((date, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => {
                              const newDates = [...recordDates];
                              newDates[idx] = e.target.value;
                              setRecordDates(newDates);
                            }}
                            className="input-field flex-1"
                          />
                          {!editingRecord && recordDates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newDates = recordDates.filter((_, i) => i !== idx);
                                setRecordDates(newDates);
                              }}
                              className="p-2.5 text-rose-400 hover:bg-white/5 rounded-xl border border-rose-500/20"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {!editingRecord && (
                        <button
                          type="button"
                          onClick={() => setRecordDates([...recordDates, new Date().toISOString().split('T')[0]])}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-2"
                        >
                          <Plus className="w-3 h-3" /> Add another date
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                    <CustomSelect
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      options={[
                        { value: "ACTIVE", label: "Active / Completed" },
                        { value: "PENDING", label: "Pending" },
                        { value: "CANCELLED", label: "Cancelled" },
                        { value: "OVERDUE", label: "Overdue" },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes / Description</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide additional details..."
                    rows="3"
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Reminder Date (Optional)</label>
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-3 cursor-pointer text-slate-300 text-sm">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                      />
                      Recurring transaction
                    </label>
                  </div>
                </div>

                {isRecurring && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recurrence Pattern</label>
                    <CustomSelect
                      value={recurrencePattern}
                      onChange={(e) => setRecurrencePattern(e.target.value)}
                      options={[
                        { value: "DAILY", label: "Daily" },
                        { value: "WEEKLY", label: "Weekly" },
                        { value: "MONTHLY", label: "Monthly" },
                        { value: "YEARLY", label: "Yearly" },
                      ]}
                    />
                  </div>
                )}

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
                    {editingRecord ? 'Save Changes' : 'Create Record'}
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
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
