import React from 'react';
import { DemoProvider } from './context/DemoContext';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  return (
    <DemoProvider>
      <AppLayout />
    </DemoProvider>
  );
}
