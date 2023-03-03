import React from "react";
import { useState, useEffect } from "react";
import { atom, useSetRecoilState } from "recoil";
import axios from "axios";

import Main from "./Main";


// Recoil state for API keys
export const apiKeysState = atom({
  key: "KeysState",
  default: [],
});

// Recoil state for module settings
export const modulesState = atom({
  key: "ModulesState",
  default: [],
});

// Recoil state for general settings
export const generalSettingsState = atom({
  key: "GeneralSettingsState",
  default: [],
});

export const newsfeedState = atom({
  key: "NewsfeedState",
  default: [],
});

export const newsfeedListState = atom({
  key: "NewsfeedListState",
  default: [],
});

function App() {
  const [apikeyLoaded, setApikeyLoaded] = useState(false);
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [generalSettingsLoaded, setGeneralSettingsLoaded] = useState(false);
  const [newsfeedListLoaded, setNewsfeedListLoaded] = useState(false);

  const setApiKeys = useSetRecoilState(apiKeysState);
  const setGeneralSettings = useSetRecoilState(generalSettingsState);
  const setModules = useSetRecoilState(modulesState);
  const setNewsfeedList = useSetRecoilState(newsfeedListState);

  useEffect(() => {
    // Get state of API keys
    axios
      .get("http://localhost:8000/api/apikeys/is_active")
      .then((response) => {
        const result = response.data;
        setApiKeys(result);
        setApikeyLoaded(true);
      });

    // Get module settings
    axios
      .get("http://localhost:8000/api/settings/modules/")
      .then((response) => {
        const result = response.data.reduce((dict, item) => {
          const { name, ...rest } = item;
          dict[name] = rest;
          return dict;
        }, {});
        setModules(result);
        setModulesLoaded(true);
      });

    // Get general settings
    axios
      .get("http://localhost:8000/api/settings/general/")
      .then((response) => {
        const result = response.data[0];
        setGeneralSettings(result);
        setGeneralSettingsLoaded(true);
      });

    // Get list of RSS feeds
    axios
      .get("http://localhost:8000/api/settings/modules/newsfeed/")
      .then((response) => {
        const result = response.data.reduce((dict, item) => {
          const { name, ...rest } = item;
          dict[name] = rest;
          return dict;
        }, {});
        setNewsfeedList(result);
        setNewsfeedListLoaded(true);
      });
  }, []);

  if (
    modulesLoaded &&
    apikeyLoaded &&
    generalSettingsLoaded &&
    newsfeedListLoaded
  ) {
    return <Main />;
  }
}

export default App;
