import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
// Tipografía institucional (incluida en el build, no depende de Google Fonts)
import '@fontsource/inter-tight/latin-400.css'
import '@fontsource/inter-tight/latin-500.css'
import '@fontsource/inter-tight/latin-600.css'
import '@fontsource/inter-tight/latin-700.css'
import './index.css'
import App from './App.jsx'
import { store } from './store/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </StrictMode>,
)
