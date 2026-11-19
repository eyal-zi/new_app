import {
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
  redirect,
} from '@tanstack/react-router';

import { requireSession } from '@/core/auth/require-session';
import { SessionGate } from '@/core/auth/session-gate';
import { NotFoundPage } from '@/core/pages/not-found-page';
import { SigningIn } from '@/core/pages/signing-in';
import { UnauthorizedRoute } from '@/core/pages/unauthorized-route';
import { Layout } from '@/demo/layout/layout';
import { EvaluationPage } from '@/evaluation/pages/evaluation-page';
import { InferencePage } from '@/inference/pages/inference-page';
import { EvaluationSessionsResultsPage } from '@/results/pages/evaluation-sessions-results-page';
import { SessionResultsPage } from '@/results/pages/session-results-page';
import { validateResultsSearch } from '@/results/utils/validate-results-search';
import {
  EVALUATION_RESULTS_ROUTE_PATH,
  RESULTS_ROUTE_PATH,
  SESSIONS_PATH,
} from '@/sessions/consts';
import { SessionsPage } from '@/sessions/pages/sessions-page';
import { SESSION_TYPE_PATHS } from '@/shared/session-type-constants';
import { ErrorState } from '@/shared/ui/states';
import { TrainingPage } from '@/training/pages/training-page';

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

// There's no home page: land on the first session type.
const index = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: SESSION_TYPE_PATHS.training });
  },
});
const sessions = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSIONS_PATH,
  component: SessionsPage,
});
const training = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSION_TYPE_PATHS.training,
  component: TrainingPage,
});
const inference = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSION_TYPE_PATHS.inference,
  component: InferencePage,
});
const evaluation = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSION_TYPE_PATHS.evaluation,
  component: EvaluationPage,
});

const evaluationResults = createRoute({
  getParentRoute: () => layoutRoute,
  path: EVALUATION_RESULTS_ROUTE_PATH,
  validateSearch: validateResultsSearch,
  component: EvaluationSessionsResultsPage,
});

const results = createRoute({
  getParentRoute: () => layoutRoute,
  path: RESULTS_ROUTE_PATH,
  component: SessionResultsPage,
});

export const createAppRouter = () =>
  createRouter({
    routeTree: root.addChildren([
      unauthorizedRoute,
      layoutRoute.addChildren([
        index,
        sessions,
        training,
        inference,
        evaluation,
        evaluationResults,
        results,
      ]),
    ]),
    defaultPreload: false,
  });

export const router = createAppRouter();
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
