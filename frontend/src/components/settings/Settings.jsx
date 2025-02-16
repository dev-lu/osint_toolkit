import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from '../NotFound'

import General from './General'
import About from './About'
import ApiKeys from './ApiKeys'
import Modules from './Modules'


export default function Settings() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="apikeys" replace />} />
        <Route path="apikeys" element={<ApiKeys />} />
        <Route path="modules" element={<Modules />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
