import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SingleLookup from './ioc-lookup/single-lookup/SingleLookup';
import BulkLookup from './ioc-lookup/bulk-lookup/BulkLookup';
import IocExtractor from './ioc-extractor/IocExtractor';
import IocDefanger from './ioc-defanger/IocDefanger';

const IocTools = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="lookup" replace />} />
      <Route path="lookup" element={<SingleLookup />} />
      <Route path="bulk/*" element={<BulkLookup />} />
      <Route path="extractor" element={<IocExtractor />} />
      <Route path="defanger" element={<IocDefanger />} />
    </Routes>
  );
};

export default IocTools;
