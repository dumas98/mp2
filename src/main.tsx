import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'normalize.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'
import { ProductsProvider } from './context/ProductsProvider.tsx'

// useTransitions={false}: apply URL changes immediately. The search box's text
// lives in the URL, and delayed (transition) updates made fast typing drop letters.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL} useTransitions={false}>
      <ProductsProvider>
        <App />
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>,
)
