import { useState } from 'react';
import { COLORS } from '../constants';

function Settings({ categories, budgets }) {
  const [localBudgets, setLocalBudgets] = useState(budgets);
  const [newCategory, setNewCategory] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAddCategory = async () => {
    //   if (!newCategory.trim()) return;
    //   if (categories.some((c) => c.name === newCategory.trim())) {
    //     alert('이미 존재하는 카테고리입니다.');
    //     return;
    //   }
    //   await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'categories'), {
    //     name: newCategory.trim(),
    //     createdAt: serverTimestamp(),
    //   });
    //   setNewCategory('');
  };

  const handleSaveBudget = async (cat) => {
    //   await setDoc(
    //     doc(db, 'artifacts', appId, 'public', 'data', 'budgets', cat),
    //     { amount: Number(localBudgets[cat] || 0) },
    //     { merge: true }
    //   );
    //   alert(`${cat} 예산이 저장되었습니다.`);
    // };
    // const handleAddCategory = async () => {
    //   if (!newCategory.trim()) return;
    //   if (categories.some((c) => c.name === newCategory.trim())) {
    //     alert('이미 존재하는 카테고리입니다.');
    //     return;
    //   }
    //   await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'categories'), {
    //     name: newCategory.trim(),
    //     createdAt: serverTimestamp(),
    //   });
    //   setNewCategory('');
  };

  // Advanced: Delete with migration
  const handleDeleteCategory = async (id, name) => {
    //   // 1. Check if used
    //   const q = query(
    //     collection(db, 'artifacts', appId, 'public', 'data', 'transactions'),
    //     where('category', '==', name)
    //   );
    //   const snaps = await getDocs(q);
    //   const count = snaps.size;
    //   let confirmMsg = `'${name}' 카테고리를 삭제하시겠습니까?`;
    //   if (count > 0) {
    //     confirmMsg += `\n\n⚠️ 주의: 이 카테고리로 작성된 내역이 ${count}건 있습니다.\n삭제 시 해당 내역들은 모두 '기타'로 변경됩니다.`;
    //   }
    //   if (!window.confirm(confirmMsg)) return;
    //   try {
    //     const batch = writeBatch(db);
    //     // Delete category doc
    //     batch.delete(doc(db, 'artifacts', appId, 'public', 'data', 'categories', id));
    //     // Delete budget doc if exists
    //     if (budgets[name]) {
    //       batch.delete(doc(db, 'artifacts', appId, 'public', 'data', 'budgets', name));
    //     }
    //     // Migrate transactions to '기타'
    //     snaps.forEach((d) => {
    //       batch.update(d.ref, { category: '기타' });
    //     });
    //     await batch.commit();
    //     alert('삭제 및 내역 이동이 완료되었습니다.');
    //   } catch (e) {
    //     console.error(e);
    //     alert('삭제 중 오류가 발생했습니다.');
    //   }
  };

  // Advanced: Rename Category
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id, oldName) => {
    //     if (!editName.trim() || editName === oldName) {
    //       cancelEdit();
    //       return;
    //     }
    //     if (categories.some((c) => c.name === editName.trim() && c.id !== id)) {
    //       alert('이미 존재하는 이름입니다.');
    //       return;
    //     }
    //     const newName = editName.trim();
    //     if (
    //       !window.confirm(
    //         `'${oldName}'을(를) '${newName}'(으)로 변경하시겠습니까?\n모든 과거 내역도 함께 변경됩니다.`
    //       )
    //     )
    //       return;
    //     try {
    //       const batch = writeBatch(db);
    //       // 1. Update Category Doc
    //       batch.update(doc(db, 'artifacts', appId, 'public', 'data', 'categories', id), {
    //         name: newName,
    //       });
    //       // 2. Update Transactions (Batch update)
    //       const q = query(
    //         collection(db, 'artifacts', appId, 'public', 'data', 'transactions'),
    //         where('category', '==', oldName)
    //       );
    //       const snaps = await getDocs(q);
    //       snaps.forEach((d) => {
    //         batch.update(d.ref, { category: newName });
    //       });
    //       // 3. Update Budget (Move document data)
    //       if (budgets[oldName]) {
    //         batch.set(doc(db, 'artifacts', appId, 'public', 'data', 'budgets', newName), {
    //           amount: budgets[oldName],
    //         });
    //         batch.delete(doc(db, 'artifacts', appId, 'public', 'data', 'budgets', oldName));
    //       }
    //       await batch.commit();
    //       cancelEdit();
    //     } catch (e) {
    //       console.error(e);
    //       alert('수정 중 오류가 발생했습니다.');
    //     }
  };

  return (
    <div className='space-y-6'>
      {/* Category Management */}
      <div className={`${COLORS.white} p-5 rounded-xl border ${COLORS.border} shadow-sm`}>
        <h3 className={`font-bold ${COLORS.text} mb-4`}>카테고리 관리</h3>
        <p className='text-xs text-gray-400 mb-4'>
          카테고리는 월 구분 없이 전체 기간에 공통으로 적용됩니다.
        </p>

        {/* Add New */}
        <div className='flex gap-2 mb-4'>
          <input
            type='text'
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder='새 카테고리 추가'
            className='flex-1 p-2 border rounded-lg text-sm bg-[#FEFDF5]'
          />
          <button
            onClick={handleAddCategory}
            className={`px-3 py-2 ${COLORS.primary} text-[#6B4E38] rounded-lg`}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* List & Edit */}
        <div className='flex flex-col gap-2'>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className='flex items-center justify-between bg-[#F0E6D2] px-4 py-2 rounded-xl text-sm text-[#5A4635]'
            >
              {editingId === cat.id ? (
                <div className='flex flex-1 items-center gap-2'>
                  <input
                    type='text'
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className='flex-1 p-1 px-2 rounded border border-[#E0D0B8] text-sm'
                    autoFocus
                  />
                  <button onClick={() => saveEdit(cat.id, cat.name)} className='text-green-600 p-1'>
                    <Save size={16} />
                  </button>
                  <button onClick={cancelEdit} className='text-gray-500 p-1'>
                    <RotateCcw size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => startEdit(cat)}
                      className='text-gray-500 hover:text-[#6B4E38]'
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className='text-gray-500 hover:text-red-500'
                    >
                      <X size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Budget Management */}
      <div className={`${COLORS.white} p-5 rounded-xl border ${COLORS.border} shadow-sm`}>
        <h3 className={`font-bold ${COLORS.text} mb-4`}>카테고리별 예산 설정</h3>
        <div className='space-y-3'>
          {categories.map((cat) => (
            <div key={cat.id} className='flex items-center gap-2'>
              <span className='w-16 text-sm text-gray-600 truncate'>{cat.name}</span>
              <input
                type='number'
                value={localBudgets[cat.name] || ''}
                onChange={(e) => setLocalBudgets({ ...localBudgets, [cat.name]: e.target.value })}
                placeholder='0'
                className='flex-1 p-2 border rounded-lg text-sm bg-[#FEFDF5]'
              />
              <button
                onClick={() => handleSaveBudget(cat.name)}
                className='px-3 py-2 bg-[#F4E06D] text-[#6B4E38] text-xs font-bold rounded-lg whitespace-nowrap'
              >
                저장
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
