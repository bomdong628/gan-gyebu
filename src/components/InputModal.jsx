import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { COLORS, METHODS, PAYERS } from '../constants';
import { db } from '../utils/firebase';

function InputModal({
  itemInfo,
  categories,
  onChangeItemInfo,
  onCloseInputModal,
  editTransactionId,
}) {
  // Helper: Add or Update Transaction
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!itemInfo?.amount || !itemInfo?.date) return;

    const finalCategory = itemInfo?.category || '기타';
    const transactionData = {
      ...itemInfo,
      amount: Number(itemInfo?.amount),
      category: finalCategory,
      type: 'expense',
    };

    try {
      if (editTransactionId) {
        // Update existing
        const docRef = doc(
          db,

          'transactions',
          editTransactionId,
        );
        await updateDoc(docRef, transactionData);
        alert('수정되었습니다.');
      } else {
        // Create new
        await addDoc(collection(db, 'transactions'), {
          ...transactionData,
          createdAt: serverTimestamp(),
        });
      }

      onCloseInputModal();
    } catch (err) {
      console.error('Save Error:', err);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center'>
      <div
        className={`${COLORS.bg} w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto pt-10 pb-10`}
        // onPaste={handlePaste} // Add paste handler here
        tabIndex={0} // Make it focusable for paste
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className={`text-xl font-bold ${COLORS.accent}`}>
            {editTransactionId ? '지출 내역 수정' : '지출 기록하기'}
          </h2>
          <button onClick={onCloseInputModal} className='text-gray-400'>
            닫기
          </button>
        </div>

        {/* AI Receipt/Capture Scan Button - Hide in edit mode */}
        {/* {!editTransactionId && (
              <div className='mb-6'>
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className='hidden'
                  id='receipt-upload'
                />
                <label
                  htmlFor='receipt-upload'
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed ${COLORS.border} bg-[#F9F5EB] text-[#6B4E38] font-bold cursor-pointer hover:bg-[#F0E6D2] transition-colors`}
                >
                  {isAnalyzing ? (
                    <span className='animate-pulse'>Gemini가 분석 중입니다... ✨</span>
                  ) : (
                    <>
                      <div className='flex gap-1'>
                        <Camera size={20} />
                        <ImageIcon size={20} />
                      </div>
                      <span>영수증/캡처 업로드 (AI 자동) ✨</span>
                    </>
                  )}
                </label>
              </div>
            )} */}

        <form onSubmit={handleSaveTransaction} className='space-y-4'>
          <div className='relative'>
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold'>
              ₩
            </span>
            <input
              type='number'
              value={itemInfo?.amount}
              onChange={(e) => onChangeItemInfo({ name: 'amount', value: e.target.value })}
              className='w-full p-4 pl-10 text-2xl font-bold rounded-2xl border-2 border-[#E0D0B8] focus:border-[#F4E06D] outline-none bg-white text-[#5A4635]'
              placeholder='0'
              autoFocus
            />
          </div>

          <div className='flex gap-2'>
            <input
              type='date'
              value={itemInfo?.date}
              onChange={(e) => onChangeItemInfo({ name: 'date', value: e.target.value })}
              className='flex-1 p-3 rounded-xl border border-[#E0D0B8] bg-white text-sm'
            />
            <select
              value={itemInfo?.category}
              onChange={(e) => onChangeItemInfo({ name: 'category', value: e.target.value })}
              className='flex-1 p-3 rounded-xl border border-[#E0D0B8] bg-white text-sm'
            >
              {categories?.map((c) => (
                <option key={c?.id} value={c?.name}>
                  {c?.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type='text'
            value={itemInfo?.description}
            onChange={(e) => onChangeItemInfo({ name: 'description', value: e.target.value })}
            placeholder='내용 (예: 장보기, 택시)'
            className='w-full p-3 rounded-xl border border-[#E0D0B8] bg-white text-sm'
          />

          <div className='space-y-2'>
            <label className='text-xs font-bold text-gray-500 ml-1'>누가 냈나요?</label>
            <div className='flex gap-2'>
              {PAYERS.map((p) => (
                <button
                  key={p}
                  type='button'
                  onClick={() => onChangeItemInfo({ name: 'payer', value: p })}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                    itemInfo?.payer === p
                      ? 'bg-[#F4E06D] text-[#6B4E38] border-2 border-[#6B4E38]'
                      : 'bg-white border border-[#E0D0B8] text-gray-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-bold text-gray-500 ml-1'>결제 수단</label>
            <div className='flex gap-2'>
              {METHODS.map((m) => (
                <button
                  key={m}
                  type='button'
                  onClick={() => onChangeItemInfo({ name: 'method', value: m })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium ${
                    itemInfo?.method === m ? 'bg-[#D6C098] text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            type='submit'
            className={`w-full py-4 mt-4 rounded-xl ${COLORS.accentBg} text-white font-bold text-lg shadow-md active:scale-95 transition-transform`}
          >
            {editTransactionId ? '수정 완료' : '기록하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputModal;
