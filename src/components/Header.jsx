import { COLORS, MENU } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Header({ activeTab, currentMonth, setCurrentMonth }) {
  return (
    <header className={`${COLORS.primary} p-6 pb-8 rounded-b-[30px] shadow-sm relative z-10`}>
      <div className='flex justify-between items-center mb-4'>
        <h1 className={`text-2xl font-black ${COLORS.accent} tracking-tight`}>
          {activeTab === MENU.SETTING ? '설정' : '간계부'}
        </h1>
        {activeTab !== MENU.SETTING && (
          <div className='flex gap-2'>
            <button
              onClick={() => {
                const prev = new Date(currentMonth);
                prev.setMonth(prev.getMonth() - 1);
                setCurrentMonth(prev);
              }}
              className='p-1 rounded-full bg-white/30 hover:bg-white/50 text-[#6B4E38]'
            >
              <ChevronLeft size={20} />
            </button>
            <span className={`font-bold ${COLORS.accent} text-lg`}>
              {currentMonth.getMonth() + 1}월
            </span>
            <button
              onClick={() => {
                const next = new Date(currentMonth);
                next.setMonth(next.getMonth() + 1);
                setCurrentMonth(next);
              }}
              className='p-1 rounded-full bg-white/30 hover:bg-white/50 text-[#6B4E38]'
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
