import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLORS } from '../constants';
import { formatMoney } from '../utils';
import { PieChart as PieIcon, User } from 'lucide-react';

function Stats({ filteredTransactions }) {
  const catTotals = {};
  filteredTransactions.forEach((t) => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const pieData = Object.keys(catTotals).map((k) => ({ name: k, value: catTotals[k] }));
  const payerTotals = { 남편: 0, 아내: 0, 공동: 0 };
  filteredTransactions.forEach((t) => {
    payerTotals[t.payer] = (payerTotals[t.payer] || 0) + t.amount;
  });
  const barData = Object.keys(payerTotals).map((k) => ({ name: k, amount: payerTotals[k] }));

  return (
    <div className='space-y-6'>
      <div className={`${COLORS.white} p-5 rounded-xl border ${COLORS.border} shadow-sm`}>
        <h3 className={`font-bold ${COLORS.text} mb-4 flex items-center gap-2`}>
          <PieIcon size={16} /> 카테고리별 지출
        </h3>
        <div className='h-64 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={`${COLORS.white} p-5 rounded-xl border ${COLORS.border} shadow-sm`}>
        <h3 className={`font-bold ${COLORS.text} mb-4 flex items-center gap-2`}>
          <User size={16} /> 지출자별 현황
        </h3>
        <div className='h-48 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={barData} layout='vertical'>
              <XAxis type='number' hide />
              <YAxis type='category' dataKey='name' width={40} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatMoney(value)} cursor={{ fill: 'transparent' }} />
              <Bar dataKey='amount' fill='#D6C098' radius={[0, 4, 4, 0]} barSize={20}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === '남편'
                        ? '#93C5FD'
                        : entry.name === '아내'
                        ? '#FCA5A5'
                        : '#F4E06D'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Stats;
