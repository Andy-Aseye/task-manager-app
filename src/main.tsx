import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import TaskProvider from './contexts/TaskContext.tsx';
import FilterProvider from './contexts/FilterContext.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </TaskProvider>
  </StrictMode>
);
