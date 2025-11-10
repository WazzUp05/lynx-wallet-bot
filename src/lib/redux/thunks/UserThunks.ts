import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@/lib/helpers/url';
import { setUser, UserProp } from '../slices/userSlice';

export const fetchUser = createAsyncThunk('me/fetchUser', async (_, { dispatch, getState }) => {
  const { user } = getState() as { user: { data: { telegram_id: number } } };

  // Dev mock: если NEXT_PUBLIC_DEV_MOCK_USER_FUNDS=1 — подставляем локальный мерчант с балансом
  if (process.env.NEXT_PUBLIC_DEV_MOCK_USER_FUNDS === '1') {
    const devAddress = process.env.NEXT_PUBLIC_DEV_MOCK_USER_ADDRESS || '';
    const devBalance = Number(process.env.NEXT_PUBLIC_DEV_MOCK_USER_BALANCE || 100);
    const now = new Date().toISOString();
    const mockMerchant: UserProp = {
      id:
        typeof user?.data?.telegram_id === 'number'
          ? user.data.telegram_id
          : Number(user?.data?.telegram_id) || 0,
      name: 'Dev User',
      telegram_id: user?.data?.telegram_id.toString(),
      first_name: 'Dev',
      last_name: 'User',
      username: 'dev_user',
      photo_url: undefined,
      is_active: true,
      created_at: now,
      updated_at: now,
      wallet: {
        id: 1,
        network: 'TRC20',
        address: devAddress,
        balance: devBalance,
        balance_usdt: devBalance,
        created_at: now,
      },
    };
    console.log('fetchUser: using dev mock merchant', mockMerchant);
    dispatch(setUser(mockMerchant));
    return;
  }

  const res = await fetch(`${API_URL}/merchant/me`, {
    headers: {
      Accept: 'application/json',
      'X-Telegram-ID': user.data.telegram_id.toString(),
    },
  });
  const data = await res.json();

  if (data.success && data.merchant) {
    dispatch(setUser(data.merchant));
  }
});
