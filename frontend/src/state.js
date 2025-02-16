import { atom } from "recoil";

export const apiKeysState = atom({
  key: "KeysState",
  default: [],
});

export const modulesState = atom({
  key: "ModulesState",
  default: [],
});

export const generalSettingsState = atom({
  key: "GeneralSettingsState",
  default: {},
});

export const newsfeedListState = atom({
  key: "NewsfeedListState",
  default: [],
});

export const newsfeedState = atom({
  key: "NewsfeedState",
  default: [],
});
