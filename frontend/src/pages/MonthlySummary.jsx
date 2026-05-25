import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api';
import { toast } from 'react-hot-toast';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const formatLKR = (val) => {
  const num = parseFloat(val) || 0;
  return 'Rs. ' + new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export default function MonthlySummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.get();
      const resData = response.data;
      if (resData?.monthlyTrends) {
        resData.monthlyTrends = resData.monthlyTrends.filter(m => m.INCOME > 0 || m.EXPENSE > 0 || m.SAVINGS > 0);
      }
      setData(resData);
    } catch (err) {
      toast.error('Failed to load monthly summary data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="h-96 skeleton" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Monthly Summary</h1>
        <p className="text-slate-400 text-sm mt-1">Detailed breakdown of your finances month over month.</p>
      </div>

      <div className="glass-card p-6 h-[400px]">
        <h4 className="text-lg font-bold text-white mb-6">Income vs Expense Trend</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.monthlyTrends}>
            <defs>
              <linearGradient id="colorIncSum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpSum" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="INCOME" name="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncSum)" />
            <Area type="monotone" dataKey="EXPENSE" name="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpSum)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {data?.monthlyTrends?.slice().reverse().map((monthData, idx) => {
          const net = monthData.INCOME - monthData.EXPENSE;
          const isPositive = net >= 0;
          return (
            <div key={idx} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{monthData.month}</h4>
                  <p className="text-slate-400 text-xs mt-1">Monthly Performance</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 md:pl-12">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Income</p>
                  <p className="text-emerald-400 font-bold">{formatLKR(monthData.INCOME)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Expense</p>
                  <p className="text-rose-400 font-bold">{formatLKR(monthData.EXPENSE)}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Net Balance</p>
                  <div className={`flex items-center gap-1 font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {formatLKR(net)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
