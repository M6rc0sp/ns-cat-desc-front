import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Examples, Home, Products, EditorPage, InstallPage } from '@/pages';

const Router: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/ns/install" element={<InstallPage />} />
    <Route path="/products" element={<Products />} />
    <Route path="/examples" element={<Examples />} />
    <Route path="/editor/:categoryId" element={<EditorPage />} />
    <Route path="/editor" element={<EditorPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default Router;
