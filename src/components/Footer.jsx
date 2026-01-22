import { Calendar, List, PieChart as PieIcon, Settings, DollarSign } from 'lucide-react';
import { COLORS, MENU } from '../constants';

function Footer({ activeTab, setActiveTab }) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 ${COLORS.white} border-t ${COLORS.border} pt-4 max-w-md mx-auto z-40 pb-[env(safe-area-inset-bottom)]`}
    >
      <div className='flex justify-around items-center h-14 pb-5'>
        <button
          onClick={() => setActiveTab(MENU.HOME)}
          className={`flex flex-col items-center gap-1 w-14 ${
            activeTab === MENU.HOME ? COLORS.accent : 'text-gray-300'
          }`}
        >
          <DollarSign size={20} strokeWidth={activeTab === MENU.HOME ? 3 : 2} />
          <span className='text-[10px] font-bold'>홈</span>
        </button>
        <button
          onClick={() => setActiveTab(MENU.LIST)}
          className={`flex flex-col items-center gap-1 w-14 ${
            activeTab === MENU.LIST ? COLORS.accent : 'text-gray-300'
          }`}
        >
          <List size={20} strokeWidth={activeTab === MENU.LIST ? 3 : 2} />
          <span className='text-[10px] font-bold'>내역</span>
        </button>
        <div className='w-14'></div>
        <button
          onClick={() => setActiveTab(MENU.CALENDER)}
          className={`flex flex-col items-center gap-1 w-14 ${
            activeTab === MENU.CALENDER ? COLORS.accent : 'text-gray-300'
          }`}
        >
          <Calendar size={20} strokeWidth={activeTab === MENU.CALENDER ? 3 : 2} />
          <span className='text-[10px] font-bold'>달력</span>
        </button>
        <button
          onClick={() => setActiveTab(MENU.STATS)}
          className={`flex flex-col items-center gap-1 w-14 ${
            activeTab === MENU.STATS ? COLORS.accent : 'text-gray-300'
          }`}
        >
          <PieIcon size={20} strokeWidth={activeTab === MENU.STATS ? 3 : 2} />
          <span className='text-[10px] font-bold'>통계</span>
        </button>
        <button
          onClick={() => setActiveTab(MENU.SETTING)}
          className={`flex flex-col items-center gap-1 w-14 ${
            activeTab === MENU.SETTING ? COLORS.accent : 'text-gray-300'
          }`}
        >
          <Settings size={20} strokeWidth={activeTab === MENU.SETTING ? 3 : 2} />
          <span className='text-[10px] font-bold'>설정</span>
        </button>
      </div>
    </nav>
  );
}

export default Footer;
