import { useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { GroupsProvider } from './context/GroupsContext.tsx';
import { Header } from './components/Header.tsx';
import { AdvertiserModal } from './components/AdvertiserModal.tsx';
import { DirectoryPage } from './pages/DirectoryPage.tsx';
import { GroupDetailPage } from './pages/GroupDetailPage.tsx';
import { StoriesPage } from './pages/StoriesPage.tsx';

function AppShell() {
  const [advertiserModalOpen, setAdvertiserModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header onOpenAdvertiserModal={() => setAdvertiserModalOpen(true)} />

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <DirectoryPage
                onOpenAdvertiserModal={() => setAdvertiserModalOpen(true)}
              />
            }
          />
          <Route
            path="/stories"
            element={
              <StoriesPage
                onOpenAdvertiserModal={() => setAdvertiserModalOpen(true)}
              />
            }
          />
          <Route
            path="/group/:id"
            element={
              <GroupDetailPage
                onOpenAdvertiserModal={() => setAdvertiserModalOpen(true)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-base text-slate-600">
          <div>
            <p className="font-display font-bold text-lg text-slate-900">
              Bellarine Active Retirees
            </p>
            <p>Connecting seniors 65+ across the Bellarine Peninsula, Victoria.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <Link to="/" className="hover:text-teal-700 underline underline-offset-4">
              Directory
            </Link>
            <Link
              to="/stories"
              className="hover:text-teal-700 underline underline-offset-4"
            >
              Feel-Good Stories
            </Link>
            <button
              type="button"
              onClick={() => setAdvertiserModalOpen(true)}
              className="hover:text-teal-700 underline underline-offset-4 cursor-pointer"
            >
              Advertise with us
            </button>
          </div>
        </div>
      </footer>

      <AdvertiserModal
        isOpen={advertiserModalOpen}
        onClose={() => setAdvertiserModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GroupsProvider>
        <AppShell />
      </GroupsProvider>
    </BrowserRouter>
  );
}
