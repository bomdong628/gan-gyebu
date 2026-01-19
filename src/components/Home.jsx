import { Pencil } from 'lucide-react';
import { COLORS, MENU } from '../constants';
import { formatMoney } from '../utils';

function Home({ categories, currentMonth, setActiveTab, filteredTransactions, onEditItemInfo }) {
  const monthlyTotal = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className='space-y-6'>
      <div
        className={`${COLORS.white} p-6 rounded-2xl shadow-sm border ${COLORS.border} flex flex-col items-center justify-center space-y-2 relative overflow-hidden`}
      >
        <h3 className={`${COLORS.accent} text-sm font-medium opacity-80`}>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월 총 지출
        </h3>
        <div className='text-4xl font-bold text-[#5A4635]'>{formatMoney(monthlyTotal)}</div>

        {/* Progress Bars */}
        <div className='flex gap-2 mt-2 w-full justify-center flex-wrap px-2'>
          {categories?.map((cat) => {
            const catName = cat.name;
            const limit = null;
            // const limit = budgets[catName];
            if (!limit) return null;
            const catTotal = filteredTransactions
              .filter((t) => t.category === catName)
              .reduce((s, t) => s + t.amount, 0);
            const percent = Math.min((catTotal / limit) * 100, 100);

            return (
              <div key={cat.id} className='flex flex-col items-center w-[18%] mb-2'>
                <div className='text-[10px] text-gray-500 mb-1 truncate w-full text-center'>
                  {catName}
                </div>
                <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className={`h-full ${percent > 90 ? 'bg-red-400' : COLORS.accentBg}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Coaching Area */}
        {/* <div className='w-full mt-4 border-t border-dashed border-[#E0D0B8] pt-4'>
          {!aiAdvice ? (
            <button
              onClick={handleGetAdvice}
              disabled={isCoaching}
              className='w-full flex items-center justify-center gap-2 py-2 bg-[#F4E06D]/30 hover:bg-[#F4E06D]/50 text-[#6B4E38] rounded-xl text-sm font-bold transition-colors'
            >
              {isCoaching ? (
                <span className='animate-pulse'>간장계란이 생각 중... 🤔</span>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>AI 소비 코칭 받기</span>
                </>
              )}
            </button>
          ) : (
            <div className='bg-[#FFF9C4] p-3 rounded-xl relative animate-fade-in'>
              <div className='flex items-start gap-2'>
                <div className='text-2xl'>🥚</div>
                <p className='text-sm text-[#5A4635] leading-relaxed whitespace-pre-line'>
                  {aiAdvice}
                </p>
              </div>
              <button
                onClick={() => setAiAdvice('')}
                className='absolute top-1 right-1 text-[#6B4E38]/50 hover:text-[#6B4E38]'
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div> */}
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between items-center px-1'>
          <h3 className={`font-bold ${COLORS.text}`}>최근 내역</h3>
          <button onClick={() => setActiveTab(MENU.LIST)} className='text-xs text-gray-400'>
            더보기
          </button>
        </div>
        {filteredTransactions.slice(0, 3).map((t) => (
          <div
            key={t.id}
            className={`${COLORS.white} p-4 rounded-xl border ${COLORS.border} flex justify-between items-center`}
          >
            <div className='flex items-center gap-3'>
              <div
                className={`w-10 h-10 rounded-full ${COLORS.secondary} flex items-center justify-center text-xl`}
              >
                {t.category === '식비' ? '🍚' : t.category === '교통' ? '🚌' : '💸'}
              </div>
              <div>
                <p className={`font-medium ${COLORS.text}`}>{t.description || t.category}</p>
                <p className='text-xs text-gray-400'>
                  {t.date} · {t.payer}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className={`font-bold ${COLORS.text}`}>-{formatMoney(t.amount)}</span>
              <button
                onClick={() => onEditItemInfo(t)}
                className='p-1 text-gray-300 hover:text-[#6B4E38]'
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <div className='text-center py-8 text-gray-400 text-sm'>이번 달 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default Home;
