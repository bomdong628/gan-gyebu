import { COLORS } from '../constants';

function Calendar({ currentMonth, filteredTransactions }) {
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const dailyTotals = {};
  filteredTransactions.forEach((t) => {
    const d = parseInt(t.date.split('-')[2]);
    dailyTotals[d] = (dailyTotals[d] || 0) + t.amount;
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className={`${COLORS.white} p-4 rounded-xl border ${COLORS.border} shadow-sm`}>
      <div className='grid grid-cols-7 gap-1 text-center mb-2'>
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div
            key={d}
            className={`text-xs font-bold ${i === 0 ? 'text-red-400' : 'text-gray-500'}`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-1'>
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`min-h-[60px] p-1 border rounded-lg ${
              day ? 'border-[#F0E6D2]' : 'border-transparent'
            } flex flex-col items-center justify-start`}
          >
            {day && (
              <>
                <span className={`text-xs ${idx % 7 === 0 ? 'text-red-400' : 'text-gray-600'}`}>
                  {day}
                </span>
                {dailyTotals[day] > 0 && (
                  <span className='text-[9px] font-bold text-[#6B4E38] mt-1 bg-[#F4E06D] px-1 rounded-sm w-full truncate text-center'>
                    {dailyTotals[day] >= 10000
                      ? Math.round(dailyTotals[day] / 10000) + '만'
                      : dailyTotals[day].toLocaleString()}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
