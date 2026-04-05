import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageLoader } from './PageLoader';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const BudgetsPage = lazy(() => import('@/pages/BudgetsPage'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const DebtsPage = lazy(() => import('@/pages/DebtsPage'));
const InvestmentsPage = lazy(() => import('@/pages/InvestmentsPage'));
const ScanReceiptPage = lazy(() => import('@/pages/ScanReceiptPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const AIPage = lazy(() => import('@/pages/AIPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function withSuspense(Component: React.ComponentType): React.ReactElement {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

const routes: RouteObject[] = [
  {
    path: '/onboarding',
    element: withSuspense(OnboardingPage),
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'transactions', element: withSuspense(TransactionsPage) },
      { path: 'budgets', element: withSuspense(BudgetsPage) },
      { path: 'goals', element: withSuspense(GoalsPage) },
      { path: 'reports', element: withSuspense(ReportsPage) },
      { path: 'categories', element: withSuspense(CategoriesPage) },
      { path: 'debts', element: withSuspense(DebtsPage) },
      { path: 'investments', element: withSuspense(InvestmentsPage) },
      { path: 'scan', element: withSuspense(ScanReceiptPage) },
      { path: 'ai', element: withSuspense(AIPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'profile', element: withSuspense(ProfilePage) },
    ],
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});
