import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SingleLookup from './single-lookup/SingleLookup';
import BulkLookup from './bulk-lookup/BulkLookup';

const IocLookup = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="single-lookup" replace />} />
      <Route path="single-lookup" element={<SingleLookup />} />
      <Route path="bulk-lookup" element={<BulkLookup />} />
    </Routes>
  );
};

export default IocLookup;
