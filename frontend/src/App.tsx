import { useState } from 'react';

interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date?: string;
}

function App() {
  // 📥 Base Data
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, title: 'Salary', amount: 50000, category: 'Salary', type: 'income', date: '2026-05-01' },
    { id: 2, title: 'House Rent', amount: 15000, category: 'Rent', type: 'expense', date: '2026-05-02' },
    { id: 3, title: 'Zomato Food', amount: 4500, category: 'Food', type: 'expense', date: '2026-05-10' },
    { id: 4, title: 'Gym Membership', amount: 2500, category: 'Other', type: 'expense', date: '2026-05-12' },
    { id: 5, title: 'Grocery Shopping', amount: 7950, category: 'Shopping', type: 'expense', date: '2026-05-15' },
  ]);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState(''); // 🔍 Search Bar State (PDF Week 3)

  // AI Dynamic Engine States (PDF Week 4)
  const [aiInsight, setAiInsight] = useState('Click "Ask AI Assistant" to generate deep financial optimization tips based on your trends! 🤖');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [error, setError] = useState('');

  // 🧮 Calculations
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpenses;

  // 📊 Expense Categorization
  const categoryTotals: { [key: string]: number } = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  // 🔍 Filter + Search Engine Combined (PDF Feature)
  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 🤖 Week 4: Smart AI Financial Insights Trigger (Client Simulation Mode)
  const generateAiInsights = () => {
    setIsAiLoading(true);
    setAiInsight('AI Agent is scanning transaction categories, analyzing spending spikes... 🧠⚡');

    setTimeout(() => {
      // Find highest expense category dynamically
      let maxCategory = 'None';
      let maxAmount = 0;
      Object.keys(categoryTotals).forEach((cat) => {
        if (categoryTotals[cat] > maxAmount) {
          maxAmount = categoryTotals[cat];
          maxCategory = cat;
        }
      });

      const savingsRate = Math.round((currentBalance / totalIncome) * 100);

      let dynamicResponse = '';
      if (savingsRate < 20) {
        dynamicResponse = `🚨 BUDGET CRITICAL ALERT: Tamal, aapka savings rate abhi sirf ${savingsRate}% hai, jo ki kaafi kam hai! Sabse bada kharcha ${maxCategory} (₹${maxAmount}) par ho raha hai. Fixed Rule lagao: agle 10 din tak non-essential spending freeze karo aur ₹5,000 extra save karne ka try karo! ✨`;
      } else {
        dynamicResponse = `🚀 EXCELLENT WEALTH HEALTH: Outstanding Tamal! Aapka wallet abhi stable hai aur aap ne ${savingsRate}% income bacha li hai. Apka major outflow ${maxCategory} (₹${maxAmount}) hai, par aap control mein ho. AI Suggestion: Is bache hue ₹${currentBalance} ko direct mutual funds ya liquid debt pool mein allocate kar do! 🍃`;
      }

      setAiInsight(dynamicResponse);
      setIsAiLoading(false);
    }, 1200); // 1.2 Second fake delay to feel like a real AI processing API
  };

  // 📝 Form Submit
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Bhai, Title daalna zaroori hai!');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Amount proper daalo!');
      return;
    }

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      title: title.trim(),
      amount: Number(amount),
      category,
      type,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setTitle('');
    setAmount('');
    setCategory('Food');
    setType('expense');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">

      {/* Header */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Finance AI Assistant Dashboard 🤖💰
          </h1>
          <p className="text-gray-500 mt-1">Hello Tamal, here is your advanced automated tracking engine.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer w-full sm:w-auto text-center"
        >
          + Add Transaction
        </button>
      </div>

      {/* Stats Section */}
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

      {/* 🧠 WEEK 4 FEATURE: Interactive Advanced AI Insight Engine */}
      <div className="max-w-6xl mx-auto bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 shadow-lg border border-indigo-500/20 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-indigo-300 flex items-center gap-2">
              Gemini AI Smart Consultant Agent 🤖
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Scans live categorizations for budget leaks and expense patterns.</p>
          </div>
          <button
            onClick={generateAiInsights}
            disabled={isAiLoading}
            className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer text-sm w-full md:w-auto shrink-0"
          >
            {isAiLoading ? 'Analyzing Patterns...' : '✨ Run AI Budget Analysis'}
          </button>
        </div>
        <p className={`text-sm leading-relaxed tracking-wide font-medium ${isAiLoading ? 'text-indigo-300 animate-pulse' : 'text-gray-200'}`}>
          {aiInsight}
        </p>
      </div>

      {/* Bottom Interface */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Logs & Search */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">

            {/* Search Input and Filter Tabs Combined */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              {/* 🔍 Dynamic Live Search Bar */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search text or category..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 w-full md:w-auto">
                <button onClick={() => setFilter('all')} className={`w-full md:w-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter === 'all' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'}`}>All</button>
                <button onClick={() => setFilter('income')} className={`w-full md:w-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter === 'income' ? 'bg-white shadow-xs text-emerald-600' : 'text-gray-500'}`}>Incomes</button>
                <button onClick={() => setFilter('expense')} className={`w-full md:w-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter === 'expense' ? 'bg-white shadow-xs text-rose-600' : 'text-gray-500'}`}>Expenses</button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
              {filteredTransactions.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">Koi item match nahi hua!</p>
              ) : (
                filteredTransactions.map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100/70 rounded-xl border border-gray-100 transition-all">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.category} • {t.date}</p>
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

        {/* Breakdown Analytics */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Spending Distributions</h3>

            {totalExpenses === 0 ? (
              <p className="text-gray-400 text-sm text-center py-12">No graph data.</p>
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
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cat === 'Food' ? 'bg-amber-500' : cat === 'Rent' ? 'bg-indigo-500' : cat === 'Shopping' ? 'bg-rose-500' : 'bg-blue-400'
                            }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Transaction</h2>
            {error && <p className="text-rose-500 text-sm font-medium mb-3">{error}</p>}
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Netflix, Salary" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden" />
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
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm cursor-pointer shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;