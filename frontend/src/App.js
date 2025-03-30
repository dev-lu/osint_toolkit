import React, { useEffect, useMemo, createContext, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Routes, Route, Navigate } from 'react-router-dom';
import api from "./api";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import HealthCheck from "./HealthCheck";
import Main from "./Main";
import NotFound from "./components/NotFound";
import AiAssistant from "./components/aiassistant/AiAssistant";
import CvssCalculator from "./components/cvss-calculator/CvssCalculator";
import Monitoring from "./components/domain-monitoring/Monitoring";
import EmailAnalyzer from "./components/email-analyzer/EmailAnalyzer";
import Analyzer from "./components/ioc-analyzer/Analyzer";
import Extractor from "./components/ioc-extractor/Extractor";
import Newsfeed from "./components/newsfeed/Newsfeed";
import Settings from "./components/settings/Settings";
import Rules from "./components/rule-creator/Rules";

import {
  apiKeysState,
  modulesState,
  generalSettingsState,
  newsfeedListState,
} from "./state";

import { lightTheme, darkTheme } from "./theme";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const setApiKeys = useSetRecoilState(apiKeysState);
  const setModules = useSetRecoilState(modulesState);
  const setGeneralSettings = useSetRecoilState(generalSettingsState);
  const setNewsfeedList = useSetRecoilState(newsfeedListState);

  const generalSettings = useRecoilValue(generalSettingsState);

  // Initialize theme mode from local storage or default to light
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode : "light";
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode); 
          return newMode;
        });
        setGeneralSettings((prevSettings) => ({
          ...prevSettings,
          darkmode: !prevSettings.darkmode,
        }));
      },
    }),
    [setMode, setGeneralSettings]
  );

  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          apikeysResponse,
          modulesResponse,
          generalSettingsResponse,
          newsfeedListResponse,
        ] = await Promise.all([
          api.get("/api/apikeys/is_active"),
          api.get("/api/settings/modules/"),
          api.get("/api/settings/general/"),
          api.get("/api/settings/modules/newsfeed/"),
        ]);
  
        setApiKeys(apikeysResponse.data);
  
        const modulesData = modulesResponse.data.reduce((dict, item) => {
          dict[item.name] = { enabled: item.enabled };
          return dict;
        }, {});
        setModules(modulesData);
  
        const generalData = generalSettingsResponse.data[0];
        setGeneralSettings(generalData);
        document.body.setAttribute("data-font", generalData.font);
  
        const newsfeedListData = newsfeedListResponse.data.reduce((dict, item) => {
          const { name, ...rest } = item;
          dict[name] = rest;
          return dict;
        }, {});
        setNewsfeedList(newsfeedListData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [setApiKeys, setGeneralSettings, setModules, setNewsfeedList]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HealthCheck>
          <Routes>
            <Route path="/" element={<Main />}>
              <Route index element={<Navigate to="/newsfeed" replace />} />
              <Route path="newsfeed/*" element={<Newsfeed />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="ai-templates/*" element={<AiAssistant />} />
              <Route path="ioc-analyzer/*" element={<Analyzer />} />
              <Route path="ioc-extractor/*" element={<Extractor />} />
              <Route path="email-analyzer/*" element={<EmailAnalyzer />} />
              <Route path="domain-monitoring/*" element={<Monitoring />} />
              <Route path="cvss-calculator/*" element={<CvssCalculator />} />
              <Route path="rules/*" element={<Rules />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HealthCheck>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;