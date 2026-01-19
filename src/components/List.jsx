import { Pencil, Trash2 } from 'lucide-react';
import { COLORS } from '../constants';

function List({ searchTerm, setSearchTerm, setSortConfig, filteredTransactions, onEditItemInfo }) {
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  const handleDelete = async (id) => {
    console.log('id', id);
    // if (window.confirm('정말 삭제하시겠습니까?')) {
    //   await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'transactions', id));
    // }
  };
  return (
    <div className='space-y-4'>
      <div className='flex gap-2 mb-4'>
        <input
          type='text'
          placeholder='검색...'
          className='w-full p-3 rounded-xl border border-[#E0D0B8] bg-white text-sm'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div
        className={`${COLORS.white} rounded-xl border ${COLORS.border} overflow-hidden shadow-sm`}
      >
        <div
          className={`${COLORS.secondary} flex p-3 text-xs font-bold ${COLORS.text} border-b ${COLORS.border}`}
        >
          <div className='flex-1 cursor-pointer' onClick={() => handleSort('date')}>
            날짜/내용
          </div>
          <div className='w-16 text-center cursor-pointer' onClick={() => handleSort('category')}>
            분류
          </div>
          <div className='w-16 text-center cursor-pointer' onClick={() => handleSort('payer')}>
            지출자
          </div>
          <div className='w-20 text-right cursor-pointer' onClick={() => handleSort('amount')}>
            금액
          </div>
          <div className='w-14 text-center'>관리</div>
        </div>
        <div className='divide-y divide-[#F0E6D2]'>
          {filteredTransactions.map((t) => (
            <div key={t.id} className='flex items-center p-3 text-sm hover:bg-[#FEFDF5]'>
              <div className='flex-1'>
                <div className={`font-medium ${COLORS.text}`}>{t.description || '내용 없음'}</div>
                <div className='text-xs text-gray-400'>{t.date.slice(5)}</div>
              </div>
              <div className='w-16 text-center text-xs text-gray-500 bg-[#F0E6D2] rounded-full py-1 mx-1 truncate'>
                {t.category}
              </div>
              <div className='w-16 text-center text-xs text-gray-500'>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    t.payer === '남편'
                      ? 'bg-blue-50 text-blue-600'
                      : t.payer === '아내'
                        ? 'bg-pink-50 text-pink-600'
                        : 'bg-gray-100'
                  }`}
                >
                  {t.payer}
                </span>
              </div>
              <div className={`w-20 text-right font-bold ${COLORS.text} truncate`}>
                {t.amount.toLocaleString()}
              </div>
              <div className='w-14 flex items-center justify-center gap-1'>
                <button
                  onClick={() => onEditItemInfo(t)}
                  className='p-1 text-gray-400 hover:text-[#6B4E38]'
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className='p-1 text-gray-400 hover:text-red-400'
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default List;
