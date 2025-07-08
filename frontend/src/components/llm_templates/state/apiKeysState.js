import { atom } from 'recoil';

export const apiKeysState = atom({
  key: 'apiKeysState',
  default: { openai: null },
});
