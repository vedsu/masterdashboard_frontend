/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import PageUnauthorizeError from "./pages/PageUnauthorizeError";

export const LINK_ROOT = "/";
export const LINK_DASHBOARD = "/dashboard";

export const LINK_WEBINAR = LINK_DASHBOARD + "/webinar";
export const LINK_CREATE_WEBINAR = LINK_WEBINAR + "/create-webinar";
export const LINK_EDIT_WEBINAR = LINK_WEBINAR + "/edit-webinar";

export const LINK_SPEAKER = LINK_DASHBOARD + "/speaker";
export const LINK_CREATE_SPEAKER = LINK_SPEAKER + "/create-speaker";
export const LINK_EDIT_SPEAKER = LINK_SPEAKER + "/edit-speaker";

export const LINK_ORDER = LINK_DASHBOARD + "/order";
export const LINK_INDUSTRY = LINK_DASHBOARD + "/industry";
export const LINK_WEBSITE = LINK_DASHBOARD + "/website";

// dynamic imports for code splitting

const AppLayout = lazy(() => import("./layouts/AppLayout"));
const PageLogin = lazy(() => import("./pages/PageLogin"));
const PageWebinarPanel = lazy(() => import("./pages/PageWebinarPanel"));
const PageSpeakerPanel = lazy(() => import("./pages/PageSpeakerPanel"));
const PageOrderPanel = lazy(() => import("./pages/PageOrderPanel"));
const PageCreateEditWebinar = lazy(() =>
  import("./pages/PageCreateEditWebinar")
);
const PageCreateEditSpeaker = lazy(() =>
  import("./pages/PageCreateEditSpeaker")
);
const PageCreateCategory = lazy(() => import("./pages/PageCreateCategory"));
const PageWebsiteConfig = lazy(() => import("./pages/PageWebsiteConfig"));

const appChildrenRoutes = [
  {
    path: LINK_WEBINAR,
    element: (
      <Suspense fallback={<Loader />}>
        <PageWebinarPanel />
      </Suspense>
    ),
  },
  {
    path: LINK_SPEAKER,
    element: (
      <Suspense fallback={<Loader />}>
        <PageSpeakerPanel />
      </Suspense>
    ),
  },
  {
    path: LINK_ORDER,
    element: (
      <Suspense fallback={<Loader />}>
        <PageOrderPanel />
      </Suspense>
    ),
  },
  {
    path: LINK_CREATE_WEBINAR,
    element: (
      <Suspense fallback={<Loader />}>
        <PageCreateEditWebinar />
      </Suspense>
    ),
  },
  {
    path: `${LINK_EDIT_WEBINAR}/:webinarId`,
    element: (
      <Suspense fallback={<Loader />}>
        <PageCreateEditWebinar />
      </Suspense>
    ),
  },
  {
    path: LINK_CREATE_SPEAKER,
    element: (
      <Suspense fallback={<Loader />}>
        <PageCreateEditSpeaker />
      </Suspense>
    ),
  },
  {
    path: `${LINK_EDIT_SPEAKER}/:speakerId`,
    element: (
      <Suspense fallback={<Loader />}>
        <PageCreateEditSpeaker />
      </Suspense>
    ),
  },
  {
    path: `${LINK_INDUSTRY}`,
    element: (
      <Suspense fallback={<Loader />}>
        <PageCreateCategory />
      </Suspense>
    ),
  },
  {
    path: `${LINK_WEBSITE}`,
    element: <PageWebsiteConfig />,
  },
];

const routes = [
  {
    path: LINK_ROOT,
    element: (
      <Suspense fallback={<Loader />}>
        <PageLogin />
      </Suspense>
    ),
    errorElement: <PageUnauthorizeError />,
  },
  {
    path: LINK_DASHBOARD,
    element: (
      <Suspense fallback={<Loader />}>
        <AppLayout />
      </Suspense>
    ),
    children: appChildrenRoutes,
  },
];

export default routes;
