import { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  History, 
  PieChart as PieChartIcon,
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
}

const CATEGORIES = {
  income: ['Salaire', 'Freelance', 'Cadeau', 'Investissement', 'Autre'],
  expense: ['Alimentation', 'Loyer', 'Transport', 'Loisirs', 'Santé', 'Shopping', 'Autre']
};

const COLORS = {
  income: '#10b981', // Emerald 500
  expense: '#f43f5e', // Rose 500
  neutral: '#3b82f6', // Blue 500
};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', description: 'Salaire Mars', amount: 2500, category: 'Salaire', date: '2026-03-25', type: 'income' },
    { id: '2', description: 'Courses Carrefour', amount: 85.50, category: 'Alimentation', date: '2026-03-26', type: 'expense' },
    { id: '3', description: 'Loyer', amount: 800, category: 'Loyer', date: '2026-04-01', type: 'expense' },
    { id: '4', description: 'Vente Vinted', amount: 45, category: 'Autre', date: '2026-04-02', type: 'income' },
    { id: '5', description: 'Netflix', amount: 13.99, category: 'Loisirs', date: '2026-04-05', type: 'expense' },
  ]);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);

  // Calculations
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const barData = useMemo(() => {
    return [
      { name: 'Revenus', total: totalIncome },
      { name: 'Dépenses', total: totalExpenses },
    ];
  }, [totalIncome, totalExpenses]);

  // Handlers
  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestion de Budget</h1>
            <p className="text-slate-500">Suivez vos finances en un clin d'œil</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <Wallet className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-lg">
              {balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Revenus Totaux</p>
              <p className="text-2xl font-bold text-emerald-600">
                +{totalIncome.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl">
              <TrendingDown className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Dépenses Totales</p>
              <p className="text-2xl font-bold text-rose-600">
                -{totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Solde Actuel</p>
              <p className={cn(
                "text-2xl font-bold",
                balance >= 0 ? "text-blue-600" : "text-rose-600"
              )}>
                {balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Form and List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add Transaction Form */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Nouvelle Transaction</h2>
              </div>
              <form onSubmit={addTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Courses, Salaire..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Montant (Ôé¼)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Type</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      const newType = e.target.value as TransactionType;
                      setType(newType);
                      setCategory(CATEGORIES[newType][0]);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="expense">Dépense</option>
                    <option value="income">Revenu</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  >
                    {CATEGORIES[type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="md:col-span-2 mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-5 h-5" />
                  Ajouter la transaction
                </button>
              </form>
            </section>

            {/* Transactions List */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Transactions Récentes</h2>
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {transactions.length} total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm">
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Catégorie</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium text-right">Montant</th>
                      <th className="px-6 py-3 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-full",
                              t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                              {t.type === 'income' ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                            </div>
                            <span className="font-medium text-slate-700">{t.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{t.category}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{t.date}</td>
                        <td className={cn(
                          "px-6 py-4 text-right font-semibold",
                          t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {t.type === 'income' ? '+' : '-'}
                          {t.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                          Aucune transaction pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar: Charts */}
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Répartition des Dépenses</h2>
              </div>
              <div className="h-64 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                    Pas assez de données
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {chartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: Object.values(COLORS)[index % Object.values(COLORS).length] }}
                      />
                      <span className="text-slate-600">{entry.name}</span>
                    </div>
                    <span className="font-medium">{entry.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Revenus vs Dépenses</h2>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Revenus' ? COLORS.income : COLORS.expense} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
