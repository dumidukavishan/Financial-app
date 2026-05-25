import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import {
  TrendingUp, TrendingDown, Landmark, PiggyBank, Briefcase, CreditCard,
  PlusCircle, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Format a number as Sri Lankan Rupees: Rs. 1,250,000.00
const formatLKR = (val) => {
  const num = parseFloat(val) || 0;
  return 'Rs. ' + new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.get();
      setData(response.data);
    } catch (err) {
      toast.error('Failed to load dashboard data. Starting with default workspace.');
      setData({
        totalIncome: 750000,
        totalExpenses: 320000,
        totalSavings: 150000,
        totalInvestments: 500000,
        totalLoans: 120000,
        netBalance: 430000,
        monthlyIncome: 420000,
        monthlyExpenses: 210000,
        monthlySavings: 80000,
        recentTransactions: [
          { id: '1', title: 'Salary Credit', type: 'INCOME', amount: 420000, recordDate: '2026-05-25', categoryName: 'Business Income', categoryColor: '#10b981', currency: 'LKR' },
          { id: '2', title: 'Electricity Bill', type: 'EXPENSE', amount: 8500, recordDate: '2026-05-24', categoryName: 'Utilities', categoryColor: '#ef4444', currency: 'LKR' },
          { id: '3', title: 'Gold Pawning Advance', type: 'INCOME', amount: 240000, recordDate: '2026-05-22', categoryName: 'Gold Pawning', categoryColor: '#f59e0b', currency: 'LKR' },
          { id: '4', title: 'Grocery Shopping', type: 'EXPENSE', amount: 15600, recordDate: '2026-05-20', categoryName: 'Groceries', categoryColor: '#6366f1', currency: 'LKR' }
        ],
        activeGoals: [
          { id: '1', title: 'Home Renovation Fund', targetAmount: 500000, currentAmount: 200000, progressPercentage: 40, color: '#06b6d4' },
          { id: '2', title: 'Children Education Fund', targetAmount: 1000000, currentAmount: 350000, progressPercentage: 35, color: '#8b5cf6' }
        ],
        monthlyTrends: [
          { month: 'Jan', INCOME: 350000, EXPENSE: 210000, SAVINGS: 50000 },
          { month: 'Feb', INCOME: 420000, EXPENSE: 240000, SAVINGS: 60000 },
          { month: 'Mar', INCOME: 390000, EXPENSE: 290000, SAVINGS: 40000 },
          { month: 'Apr', INCOME: 480000, EXPENSE: 260000, SAVINGS: 70000 },
          { month: 'May', INCOME: 550000, EXPENSE: 310000, SAVINGS: 90000 }
        ],
        expensesByCategory: [
          { category: 'Rent', amount: 120000 },
          { category: 'Groceries', amount: 45000 },
          { category: 'Utilities', amount: 18500 },
          { category: 'Transport', amount: 35000 },
          { category: 'Medical', amount: 22000 }
        ],
        incomeByCategory: [
          { category: 'Salary', amount: 420000 },
          { category: 'Freelance', amount: 85000 },
          { category: 'Gold Pawning', amount: 240000 },
          { category: 'Dividends', amount: 15000 }
        ],
        currencyBreakdown: [
          { currency: 'LKR', amount: 430000, lkrAmount: 430000, country: 'Sri Lanka', flag: '🇱🇰' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 skeleton" />
          <div className="h-10 w-24 skeleton" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 skeleton" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 skeleton" />
          <div className="h-96 skeleton" />
        </div>
      </div>
    );
  }

  const getNetBalanceGrowth = () => {
    if (!data?.monthlyTrends || data.monthlyTrends.length < 2) return { value: 0, isPositive: true };
    const current = data.monthlyTrends[data.monthlyTrends.length - 1];
    const prev = data.monthlyTrends[data.monthlyTrends.length - 2];
    const currentNet = current.INCOME - current.EXPENSE;
    const prevNet = prev.INCOME - prev.EXPENSE;
    if (prevNet === 0) return { value: 0, isPositive: true };
    const growth = ((currentNet - prevNet) / Math.abs(prevNet)) * 100;
    return { value: Math.abs(growth).toFixed(1), isPositive: growth >= 0 };
  };

  const getIncomeGrowth = () => {
    if (!data?.monthlyTrends || data.monthlyTrends.length < 2) return { value: 0, isPositive: true };
    const current = data.monthlyTrends[data.monthlyTrends.length - 1];
    const prev = data.monthlyTrends[data.monthlyTrends.length - 2];
    if (prev.INCOME === 0) return { value: 0, isPositive: true };
    const growth = ((current.INCOME - prev.INCOME) / prev.INCOME) * 100;
    return { value: Math.abs(growth).toFixed(1), isPositive: growth >= 0 };
  };

  const getExpenseRatio = () => {
    if (!data?.monthlyIncome || data.monthlyIncome === 0) return 0;
    return ((data.monthlyExpenses / data.monthlyIncome) * 100).toFixed(1);
  };

  const netGrowth = getNetBalanceGrowth();
  const incGrowth = getIncomeGrowth();
  const expRatio = getExpenseRatio();

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Financial Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time overview of your financial operating system — Sri Lanka Rupees (LKR).</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="btn-ghost p-3 rounded-xl flex items-center justify-center hover:scale-105 transition-transform self-start md:self-auto"
          title="Refresh Ledger"
        >
          <RefreshCw className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Main KPI Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Net Balance</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
                {formatLKR(data?.netBalance)}
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${netGrowth.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netGrowth.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{netGrowth.isPositive ? '+' : '-'}{netGrowth.value}% from last month</span>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Income</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
                {formatLKR(data?.monthlyIncome)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${incGrowth.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {incGrowth.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{incGrowth.isPositive ? '+' : '-'}{incGrowth.value}% from last month</span>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Expenses</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
                {formatLKR(data?.monthlyExpenses)}
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-rose-400 text-xs font-semibold">
            <TrendingDown className="w-4 h-4" />
            <span>{expRatio}% of monthly income spent</span>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-cyan-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Investments &amp; Assets</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
                {formatLKR(data?.totalInvestments)}
              </h3>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-cyan-400 text-xs font-semibold">
            <PiggyBank className="w-4 h-4" />
            <span>Active growth portfolio</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-white">Cash Flow Trends</h4>
              <p className="text-slate-400 text-xs mt-1">Income, Expense &amp; Savings comparison over time (LKR — Rs.)</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyTrends}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false}
                  tickFormatter={(v) => 'Rs.' + (v >= 1000 ? (v/1000).toFixed(0) + 'K' : v)} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(val) => [formatLKR(val), '']}
                />
                <Area type="monotone" dataKey="INCOME" name="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="EXPENSE" name="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="glass-card p-6 flex flex-col">
          <h4 className="text-lg font-bold text-white mb-2">Expense Allocation</h4>
          <p className="text-slate-400 text-xs mb-6">Distribution across dynamic categories</p>
          <div className="h-64 flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="category"
                >
                  {data?.expensesByCategory?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(val) => [formatLKR(val), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center text-center px-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Outflow</span>
              <span className="text-base font-extrabold text-white mt-1">{formatLKR(data?.monthlyExpenses)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {data?.expensesByCategory?.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate max-w-[100px]">{entry.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LKR Balance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LKR Balance Card */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-bold text-white">LKR Balance Summary</h4>
              <p className="text-slate-400 text-xs mt-1">Net asset holdings in Sri Lankan Rupees</p>
            </div>
            <span className="text-2xl">🇱🇰</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Total Income</p>
              <p className="text-xl font-extrabold text-emerald-400">{formatLKR(data?.totalIncome)}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Total Expenses</p>
              <p className="text-xl font-extrabold text-rose-400">{formatLKR(data?.totalExpenses)}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Total Savings</p>
              <p className="text-xl font-extrabold text-cyan-400">{formatLKR(data?.totalSavings)}</p>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Net Balance (LKR)</p>
              <p className="text-2xl font-extrabold text-white mt-1">{formatLKR(data?.netBalance)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Total Loans</p>
              <p className="text-sm font-bold text-amber-400">{formatLKR(data?.totalLoans)}</p>
            </div>
          </div>
        </div>

        {/* Monthly Summary Breakdown */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">This Month</h4>
            <p className="text-slate-400 text-xs mb-6">Current month breakdown in Rs.</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-300 font-semibold">Income</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">{formatLKR(data?.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-xs text-slate-300 font-semibold">Expenses</span>
                </div>
                <span className="text-xs font-bold text-rose-400">{formatLKR(data?.monthlyExpenses)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs text-slate-300 font-semibold">Savings</span>
                </div>
                <span className="text-xs font-bold text-cyan-400">{formatLKR(data?.monthlySavings)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Savings Rate</div>
            <div className="w-full bg-[var(--color-surface-700)] rounded-full h-2 mb-1">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                style={{
                  width: `${data?.monthlyIncome > 0 ? Math.min(100, Math.round((data?.monthlySavings / data?.monthlyIncome) * 100)) : 0}%`
                }}
              />
            </div>
            <span className="text-xs text-slate-400">
              {data?.monthlyIncome > 0 ? Math.round((data?.monthlySavings / data?.monthlyIncome) * 100) : 0}% of income saved
            </span>
          </div>
        </div>
      </div>

      {/* Goals & Transactions list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent ledger transactions */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-white">Recent Activities</h4>
            <span className="text-xs text-indigo-400 font-semibold cursor-pointer hover:underline">View all records</span>
          </div>
          <div className="space-y-4">
            {data?.recentTransactions?.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${rec.categoryColor || '#6366f1'}20`, color: rec.categoryColor || '#6366f1' }}>
                    {rec.categoryName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{rec.title}</p>
                    <p className="text-xs text-slate-400">{rec.categoryName} • {rec.recordDate}</p>
                  </div>
                </div>
                <div className={`flex items-center font-bold text-sm ${rec.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {rec.type === 'INCOME' ? '+' : '-'} {formatLKR(rec.amount)}
                  {rec.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Target Savings Goals */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-bold text-white mb-6">Financial Goals</h4>
          <div className="space-y-6">
            {data?.activeGoals?.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>{goal.title}</span>
                  <span>{goal.progressPercentage}%</span>
                </div>
                <div className="w-full bg-[var(--color-surface-700)] rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${goal.progressPercentage}%`,
                      background: `linear-gradient(90deg, ${goal.color || '#6366f1'}, #06b6d4)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Saved: {formatLKR(goal.currentAmount)}</span>
                  <span>Target: {formatLKR(goal.targetAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
