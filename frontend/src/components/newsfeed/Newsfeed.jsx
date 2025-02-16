import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from '../NotFound'

import Settings from "./settings/Settings";
import CTISettings from "./settings/CTISettings";
import ManageNewsfeeds from "./settings/ManageNewsfeeds";
import KeywordSettings from "./settings/KeywordSettings";
import Feed from "./feed/Feed";
import Trends from "./trends/Trends";
import Report from "./news-report/Report";
import Headlines from "./headlines/Headlines";

export default function Newsfeed() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="feed" replace />} />
        <Route path="feed" element={<Feed />} />
        <Route path="trends" element={<Trends />} />
        <Route path="headlines" element={<Headlines />} />
        <Route path="report" element={<Report />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/cti" element={<CTISettings />} />
        <Route path="settings/feeds" element={<ManageNewsfeeds />} />
        <Route path="settings/keywords" element={<KeywordSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
</>
  );
}
