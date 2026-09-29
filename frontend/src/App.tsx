import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PanchayatDetailsPage } from './pages/PanchayatDetailsPage';
import { AdvisoryCentrePage } from './pages/AdvisoryCentrePage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { DataInfoPage } from './pages/DataInfoPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased selection:bg-brand-100 selection:text-brand-900">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/panchayat/:id" element={<PanchayatDetailsPage />} />
                <Route path="/advisories" element={<AdvisoryCentrePage />} />
                <Route path="/model-performance" element={<ModelPerformancePage />} />
                <Route path="/data-info" element={<DataInfoPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
