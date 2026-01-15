import { useMemo, useState } from 'react';
import { COLORS, DEFAULT_CATEGORIES, MENU } from './constants';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import AddBtn from './components/AddBtn';
import InputModal from './components/InputModal';
import List from './components/List';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeTab, setActiveTab] = useState('home');
  // Filter & Sort State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const defalutValue = {
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    payer: '공동',
    method: '카드',
  };

  // Form State
  const [itemInfo, setItemInfo] = useState(defalutValue);

  const onChangeItemInfo = ({ name, value }) =>
    setItemInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Edit State
  const [editTransactionId, setEditTransactionId] = useState(null);

  const onEditItemInfo = (t) => {
    setEditTransactionId(t.id);
    onChangeItemInfo({ name: 'amount', value: t.amount });
    onChangeItemInfo({ name: 'date', value: t.date });
    onChangeItemInfo({ name: 'category', value: t.category });
    onChangeItemInfo({ name: 'description', value: t.description });
    onChangeItemInfo({ name: 'payer', value: t.payer });
    onChangeItemInfo({ name: 'method', value: t.method || '카드' });
    setIsFormOpen(true);
  };

  const onCloseInputModal = () => {
    setIsFormOpen(false);
    setEditTransactionId(null);
    onChangeItemInfo({ name: 'amount', value: '' });
    onChangeItemInfo({ name: 'description', value: '' });
    onChangeItemInfo({ name: 'date', value: new Date().toISOString().split('T')[0] });
    onChangeItemInfo({ name: 'payer', value: '공동' });
    onChangeItemInfo({ name: 'method', value: '카드' });
    // Reset date to today only if we were editing (optional UX choice)
    // Keeping last used date might be convenient, but standard is reset
    if (categories.length > 0) onChangeItemInfo({ name: 'category', value: categories[0].name });
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        const isSameMonth =
          tDate.getMonth() === currentMonth.getMonth() &&
          tDate.getFullYear() === currentMonth.getFullYear();
        const matchesSearch =
          searchTerm === '' ||
          t.description.includes(searchTerm) ||
          t.category.includes(searchTerm) ||
          t.payer.includes(searchTerm);
        return isSameMonth && matchesSearch;
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [transactions, currentMonth, searchTerm, sortConfig]);

  return (
    <div
      className={`min-h-screen ${COLORS.bg} font-sans pb-20 max-w-md mx-auto shadow-2xl overflow-hidden`}
    >
      <Header activeTab={activeTab} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
      <main className='px-4 -mt-6 relative z-20'>
        {activeTab === MENU.HOME && (
          <Home
            currentMonth={currentMonth}
            setActiveTab={setActiveTab}
            filteredTransactions={filteredTransactions}
            onEditItemInfo={onEditItemInfo}
          />
        )}
        {activeTab === MENU.LIST && (
          <List
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSortConfig={setSortConfig}
            filteredTransactions={filteredTransactions}
            onEditItemInfo={onEditItemInfo}
          />
        )}
      </main>
      {activeTab !== '' && <AddBtn setIsFormOpen={setIsFormOpen} />}
      {isFormOpen && (
        <InputModal
          itemInfo={itemInfo}
          onChangeItemInfo={onChangeItemInfo}
          onCloseInputModal={onCloseInputModal}
          editTransactionId={editTransactionId}
        />
      )}
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
