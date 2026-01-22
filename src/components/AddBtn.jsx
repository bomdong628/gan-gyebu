import { Plus } from 'lucide-react';
import { COLORS } from '../constants';

function AddBtn({ setIsFormOpen }) {
  return (
    <button
      onClick={() => setIsFormOpen(true)}
      className={`fixed bottom-24 right-4 w-14 h-14 ${COLORS.accentBg} rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform z-50`}
      style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
    >
      <Plus size={28} />
    </button>
  );
}

export default AddBtn;
