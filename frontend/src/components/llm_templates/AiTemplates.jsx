import { Routes, Route, Navigate } from 'react-router-dom';

import TemplatesPage from './pages/TemplatesPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import NotFoundPage from './pages/NotFoundPage';

export default function AiTemplates() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ai-templates/templates" replace />} />
      <Route path="templates" element={<TemplatesPage />} />
      <Route path="create-template" element={<CreateTemplatePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
