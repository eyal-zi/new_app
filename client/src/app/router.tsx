import {
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';

import { requireSession } from '@/core/auth/require-session';
import { SessionGate } from '@/core/auth/session-gate';
import { NotFoundPage } from '@/core/pages/not-found-page';
import { SigningIn } from '@/core/pages/signing-in';
import { UnauthorizedRoute } from '@/core/pages/unauthorized-route';
import { Dashboard } from '@/demo/dashboard/dashboard';
import { Layout } from '@/demo/layout/layout';
import { SESSIONS_PATH } from '@/sessions/consts';
import { SessionsPage } from '@/sessions/pages/sessions-page';
import { ErrorState } from '@/shared/ui/states';
import { SUMMARY_B_PATH, SUMMARY_C_PATH, SUMMARY_PATH } from '@/summary/consts';
import { SummaryPage } from '@/summary/pages/summary-page';
import { SummaryPageB } from '@/summary/pages/summary-page-b';
import { SummaryPageC } from '@/summary/pages/summary-page-c';

import { Root } from './root';

const RouteError = ({ error }: ErrorComponentProps) => (
  <ErrorState
    message={error instanceof Error ? error.message : 'Something went wrong'}
  />
);

const root = createRootRoute({
  beforeLoad: requireSession,
  component: Root,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteError,
  pendingComponent: SigningIn,
  pendingMs: 0,
  pendingMinMs: 0,
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => root,
  path: '/unauthorized',
  component: UnauthorizedRoute,
});

// Replace these demo routes with your project pages. Root authentication applies to all of them.
const ProtectedLayout = () => (
  <SessionGate>
    <Layout />
  </SessionGate>
);

const layoutRoute = createRoute({
  getParentRoute: () => root,
  id: 'layout',
  component: ProtectedLayout,
});

const index = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: Dashboard,
});
const sessions = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSIONS_PATH,
  component: SessionsPage,
});

const summary = createRoute({
  getParentRoute: () => layoutRoute,
  path: SUMMARY_PATH,
  component: SummaryPage,
});

const summaryB = createRoute({
  getParentRoute: () => layoutRoute,
  path: SUMMARY_B_PATH,
  component: SummaryPageB,
});

const summaryC = createRoute({
  getParentRoute: () => layoutRoute,
  path: SUMMARY_C_PATH,
  component: SummaryPageC,
});

export const createAppRouter = () =>
  createRouter({
    routeTree: root.addChildren([
      unauthorizedRoute,
      layoutRoute.addChildren([index, sessions, summary, summaryB, summaryC]),
    ]),
    defaultPreload: false,
  });

export const router = createAppRouter();
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
