import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './routes/Layout'
import DetailView from './routes/DetailView'
import NotFound from './routes/NotFound'
const storedString = localStorage.getItem("data")
const localData = JSON.parse(storedString)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<App />}  />
                  <Route path='coinDetails/:id' element={<DetailView coins={localData}/>}/>
                  <Route path="*" element={<NotFound />}/>
                </Route>
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
