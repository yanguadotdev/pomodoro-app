import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from './context/configContext.tsx'
import { ConfigBackgroundProvider } from './context/configBackgroundContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <ConfigBackgroundProvider>
        <App />
      </ConfigBackgroundProvider>
    </ConfigProvider>
  </StrictMode>,
)
