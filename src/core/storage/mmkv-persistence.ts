import { MMKV } from 'react-native-mmkv';
import { Persistence } from 'firebase/auth';

let mmkv: MMKV | null = null;

const getMMKV = () => {
  if (!mmkv) {
    mmkv = new MMKV();
  }
  return mmkv;
};

const key = 'firebase-auth-key';

export const mmkvPersistence: Persistence = {
  type: 'LOCAL',
  _isAvailable: async () => true,
  _migrate: async () => {},
  _load: async () => {
    const data = getMMKV().getString(key);
    return data ? JSON.parse(data) : null;
  },
  _save: async (data) => {
    getMMKV().set(key, JSON.stringify(data));
  },
  _clear: async () => {
    getMMKV().delete(key);
  },
};
