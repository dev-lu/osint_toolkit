import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Sigma from './sigma/Sigma'
import Yara from './yara/Yara'
import Snort from './snort/Snort'

import NotFound from '../NotFound'

function Rules() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="sigma" replace />} />
        <Route path="Sigma" element={<Sigma />} />
        <Route path="yara" element={<Yara />} />
        <Route path="snort" element={<Snort />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Rules
