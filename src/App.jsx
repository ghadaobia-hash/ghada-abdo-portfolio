import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SiteDataProvider } from './context/SiteDataContext';
import { PortfolioPage } from './pages/PortfolioPage';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <SiteDataProvider>
          <Routes>
            <Route path="/*" element={<PortfolioPage />} />
          </Routes>
        </SiteDataProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
