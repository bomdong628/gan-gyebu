import { useEffect, useMemo, useState } from 'react';
import { COLORS, DEFAULT_CATEGORIES, MENU } from './constants';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import AddBtn from './components/AddBtn';
import InputModal from './components/InputModal';
import List from './components/List';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import Stats from './components/Stats';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, db } from './utils/firebase';

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
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
    if (categories.length > 0) {
      onChangeItemInfo({ name: 'category', value: categories[0].name });
    } else {
      onChangeItemInfo({ name: 'category', value: '' });
    }
  };

  // Helper: Delete Transaction
  const onDeleteItemInfo = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'transactions', id));
    }
  };

  // 1. Auth Initialization (내 계정용)
  useEffect(() => {
    // 1. 바로 익명 로그인 시도
    signInAnonymously(auth).catch((error) => {
      console.error('로그인 실패:', error);
    });

    // 2. 로그인 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Fetching (Categories) - Seeding if empty
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        DEFAULT_CATEGORIES.forEach((catName) => {
          const newRef = doc(collection(db, 'categories'));
          batch.set(newRef, {
            name: catName,
            createdAt: serverTimestamp(),
          });
        });
        await batch.commit().catch((e) => console.log('Seeding skipped', e));
      } else {
        const cats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCategories(cats);
        if (!itemInfo?.category && cats.length > 0) {
          onChangeItemInfo({ name: 'category', value: cats[0].name });
        }
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 3. Data Fetching (Transactions)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'transactions'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(data);
        setLoading(false);
      },
      (error) => {
        console.error('Data Fetch Error:', error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user]);

  // 4. Data Fetching (Budgets)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'budgets'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetData = {};
      snapshot.docs.forEach((doc) => {
        budgetData[doc.id] = doc.data().amount;
      });
      setBudgets(budgetData);
    });
    return () => unsubscribe();
  }, [user]);

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

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center bg-[#FEFDF5] text-[#6B4E38]'>
        로딩중...
      </div>
    );

  return (
    <div
      className={`min-h-screen ${COLORS.bg} font-sans pb-20 max-w-md mx-auto shadow-2xl overflow-hidden`}
    >
      <Header activeTab={activeTab} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
      <main className='px-4 -mt-6 relative z-20'>
        {activeTab === MENU.HOME && (
          <Home
            categories={categories}
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
        {activeTab === MENU.CALENDER && (
          <Calendar currentMonth={currentMonth} filteredTransactions={filteredTransactions} />
        )}
        {activeTab === MENU.STATS && <Stats filteredTransactions={filteredTransactions} />}
        {activeTab === MENU.SETTING && <Settings categories={categories} budgets={budgets} />}
      </main>
      {(activeTab !== '' || activeTab !== MENU.SETTING) && <AddBtn setIsFormOpen={setIsFormOpen} />}
      {isFormOpen && (
        <InputModal
          itemInfo={itemInfo}
          categories={categories}
          onChangeItemInfo={onChangeItemInfo}
          onCloseInputModal={onCloseInputModal}
          editTransactionId={editTransactionId}
        />
      )}
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='h-[env(safe-area-inset-bottom)] w-full bg-white fixed bottom-0 left-0 right-0 -z-10'></div>
    </div>
  );
}

export default App;
