import { useState, useEffect } from 'react';

interface Transaction {
  _id?: string; // MongoDB utilizes _id instead of id
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date?: string;
}

function App() {
  // 📥 Live Data State (Starting empty, will fetch from backend)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Engine States
  const [aiInsight, setAiInsight] = useState('Click "Ask AI Assistant" to generate deep financial optimization tips based on your database trends! 🤖');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [error, setError] = useState('');

  // 🌐 TARGET API URL (Your local backend port)
  const API_URL = 'http://localhost:8080/api/transactions';

  // 🔄 FETCH: Load transactions from real database on load
  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching data from MERN backend:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🧮 Live Calculations
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpenses;

  // Expense Distributions
  const categoryTotals: { [key: string]: number } = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  // Filters Engine
  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 🤖 AI Optimization Trigger
  const generateAiInsights = () => {
    setIsAiLoading(true);
    setAiInsight('AI Agent is scanning live database collections... 🧠⚡');

    setTimeout(() => {
      let maxCategory = 'None';
      let maxAmount = 0;
      Object.keys(categoryTotals).forEach((cat) => {
        if (categoryTotals[cat] > maxAmount) {
          maxAmount = categoryTotals[cat];
          maxCategory = cat;
        }
      });

      const savingsRate = totalIncome > 0 ? Math.round((currentBalance / totalIncome) * 100) : 0;

      let dynamicResponse = '';
      if (savingsRate < 20) {
        dynamicResponse = `🚨 BUDGET CRITICAL ALERT: Tamal, your real-time savings rate is currently sitting at ${savingsRate}%. Major leakage detected under "${maxCategory}" (₹${maxAmount}). AI strongly advises an immediate spending freeze on non-essential categories! ✨`;
      } else {
        dynamicResponse = `🚀 EXCELLENT WEALTH HEALTH: Fantastic job Tamal! Your dashboard balance is stable with a healthy ${savingsRate}% savings pipeline. Consider routing your net ₹${currentBalance} surplus into high-yield asset pools. 🍃`;
      }

      setAiInsight(dynamicResponse);
      setIsAiLoading(false);
    }, 1200);
  };

  // 📝 POST: Handle real database entry creation
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !amount || Number(amount) <= 0) {
      setError('Bhai, parameters sahi se fill karo!');
      return;
    }

    const payload = {
      title: title.trim(),
      amount: Number(amount),
      category,
      type
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchTransactions(); // Refresh UI lists instantly with fresh database values
        setTitle('');
        setAmount('');
        setCategory('Food');
        setType('expense');
        setIsModalOpen(false);
      } else {
        setError('Server responded with an error setup.');
      }
    } catch (err) {
      setError('Could not connect to backend APIs.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      {/* Header */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Finance AI Live Dashboard 🤖💰
          </h1>
          <p className="text-gray-500 mt-1">Hello Tamal, you are currently reading live operational data flows from MongoDB.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer w-full sm:w-auto text-center">+ Add Transaction</button>
      </div>

      {/* Summary Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 border-b-4 border-b-emerald-500">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Income</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">₹{totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 border-b-4 border-b-rose-500">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Expenses</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 border-b-4 border-b-blue-500">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Net Wallet Balance</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">₹{currentBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* AI Box */}
      <div className="max-w-6xl mx-auto bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 shadow-lg border border-indigo-500/20 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-indigo-300 flex items-center gap-2">Gemini AI Smart Consultant Agent 🤖</h3>
            <p className="text-xs text-gray-400 mt-0.5">Scans live categorizations for budget leaks and expense patterns.</p>
          </div>
          <button onClick={generateAiInsights} disabled={isAiLoading} className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer text-sm w-full md:w-auto shrink-0">
            {isAiLoading ? 'Analyzing Patterns...' : '✨ Run AI Budget Analysis'}
          </button>
        </div>
        <p className={`text-sm leading-relaxed tracking-wide font-medium ${isAiLoading ? 'text-indigo-300 animate-pulse' : 'text-gray-200'}`}>{aiInsight}</p>
      </div>

      {/* Core Layout Interface */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <div className="relative w-full md:w-72">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍 Search text or category..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-indigo-500 transition-all" />
              </div>
              <div className="flex bg-gray-100 rounded-xl p-1 w-full md:w-auto">
                <button onClick={() => setFilter('all')} className={`w-full md:w-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter === 'all' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'}`}>All</button>
                <button onClick={() => setFilter('income')} className={`w-full md:w-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter === 'income' ? 'bg-white shadow-xs text-emerald-600' : 'text-gray-500'}`}>Incomes</button>
                <button onClick={() => setFilter('expense')} className={`w-full md:w-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter === 'expense' ? 'bg-white shadow-xs text-rose-600' : 'text-gray-500'}`}>Expenses</button>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
              {filteredTransactions.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">Koi live transactional entry store nahi hai!</p>
              ) : (
                filteredTransactions.map((t) => (
                  <div key={t._id} className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100/70 rounded-xl border border-gray-100 transition-all">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.category}</p>
                    </div>
                    <span className={`font-bold text-base md:text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Spending Distributions</h3>
            {totalExpenses === 0 ? (
              <p className="text-gray-400 text-sm text-center py-12">No database graphs.</p>
            ) : (
              <div className="space-y-6">
                {Object.keys(categoryTotals).map((cat) => {
                  const amt = categoryTotals[cat];
                  const percentage = Math.min(Math.round((amt / totalExpenses) * 100), 100);
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-700">{cat}</span>
                        <span className="font-bold text-gray-900">₹{amt.toLocaleString('en-IN')} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${cat === 'Food' ? 'bg-amber-500' : cat === 'Rent' ? 'bg-indigo-500' : cat === 'Shopping' ? 'bg-rose-500' : 'bg-blue-400'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Live Transaction</h2>
            {error && <p className="text-rose-500 text-sm font-medium mb-3">{error}</p>}
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Office Bonus, Electric Bill" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-sm focus:outline-hidden">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-sm focus:outline-hidden">
                    <option value="Food">Food 🍔</option>
                    <option value="Salary">Salary 💰</option>
                    <option value="Rent">Rent 🏠</option>
                    <option value="Shopping">Shopping 🛍️</option>
                    <option value="Other">Other 🔄</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl text-sm cursor-pointer">Cancel</button>
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm cursor-pointer shadow-xs">Save to MongoDB</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;