import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from './context/configContext.tsx'
import { AmbientSoundsProvider } from './context/ambientSoundContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <AmbientSoundsProvider>
        <App />
      </AmbientSoundsProvider>
    </ConfigProvider>
  </StrictMode>,
)
