import React from "react";
import { useState, useEffect } from "react";
import { atom, useSetRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import api from "./api";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Main from "./Main";


const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

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
  const generalSettings = useRecoilValue(generalSettingsState);
  const setGeneralSettings = useSetRecoilState(generalSettingsState);
  const setModules = useSetRecoilState(modulesState);
  const setNewsfeedList = useSetRecoilState(newsfeedListState);


  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Values for light mode
            typography: {
              htmlFontSize: 16,
            },
            background: {
              default: '#ebebeb', 
              card: 'aliceblue',
              cvssCard: 'aliceblue',
              cvssCircle: 'white',
              textfieldlarge: 'white',
              uploadarea: '#fafafa',
              tableheader: 'whitesmoke',
              tablecell: 'white',
              tableborder: '#ebebeb',
            },
            components: {
              MuiCard: {
                variants: [
                  { 
                    props: {
                      variant: 'primary'
                    },
                    style: {
                      backgroundColor: "black",
                      minWidth: "450px",
                      minHeight: "300px",
                      maxWidth: "1450px",
                      margin: "30px auto",
                      border: "1px solid rgb(192, 192, 192)",
                      padding: "30px",
                      borderRadius: 5,
                      overflow: "auto",
                      boxShadow: "5"
                    },
                  },
                  { props: {variant: 'secondary'},
                    style: {
                      m:2, p:2,
                      borderRadius: 5, 
                      backgroundColor: 'black', 
                      boxShadow: 0
                    }
                  },
                ]
              }
            },
          }
        : {
            // Values for dark mode
            typography: {
              htmlFontSize: 16,
            },
            background: {
              default: '#333333',
              paper: '#404040',
              card: '#6F6F6F',
              cvssCard: '#404040',
              cvssCircle: '#6F6F6F',
              uploadarea: '#6F6F6F',
              textfieldlarge: '#6F6F6F',
              tableheader: '#333333',
              tablecell: '#595959',
              tableborder: '#333333',
            },
          }),
    },
  });

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setGeneralSettings((prevSettings) => ({
          ...prevSettings,
          darkmode: !prevSettings.darkmode,
        }));
      },
    }),
    [setGeneralSettings],
  );

  const mode = generalSettings.darkmode ? 'dark' : 'light';

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  useEffect(() => {
    // Get state of API keys
    api
      .get("/api/apikeys/is_active")
      .then((response) => {
        const result = response.data;
        setApiKeys(result);
        setApikeyLoaded(true);
      });

    // Get module settings
    api
      .get("/api/settings/modules/")
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
    api
      .get("/api/settings/general/")
      .then((response) => {
        const result = response.data[0];
        setGeneralSettings(result);
        setGeneralSettingsLoaded(true);
      });

    // Get list of RSS feeds
    api
      .get("/api/settings/modules/newsfeed/")
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
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Main />
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }
}

export default App;
