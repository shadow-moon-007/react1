import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { HomePage } from './pages/HomePage';
import { OverviewPage } from './pages/OverviewPage';
import { OrganizationPage } from './pages/OrganizationPage';
import { SubDepartmentPage } from './pages/SubDepartmentPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { QuickLinksPage } from './pages/QuickLinksPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AnnouncementDetailPage } from './pages/AnnouncementDetailPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { EventsPage } from './pages/EventsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            {/* Core Overview & Organization */}
            <Route index element={<HomePage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="organization" element={<OrganizationPage />} />
            <Route
              path="organization/:subDepartmentId"
              element={<SubDepartmentPage />}
            />
            <Route
              path="organization/:subDepartmentId/teams/:teamId"
              element={<TeamDetailPage />}
            />

            {/* Resources & Systems */}
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="quick-links" element={<QuickLinksPage />} />
            <Route path="documents" element={<DocumentsPage />} />

            {/* Communications */}
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="announcements/:id" element={<AnnouncementDetailPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="contact" element={<ContactPage />} />

            {/* Administration & CMS (Gated with ProtectedRoute) */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="Department Admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/*"
              element={
                <ProtectedRoute requiredRole="Department Admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
