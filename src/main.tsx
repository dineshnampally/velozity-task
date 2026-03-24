import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { TaskProvider } from './context/TaskContext.tsx'
import { CollaborationProvider } from './context/CollaborationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TaskProvider>
        <CollaborationProvider>
          <App />
        </CollaborationProvider>
      </TaskProvider>
    </BrowserRouter>
  </StrictMode>,
)
