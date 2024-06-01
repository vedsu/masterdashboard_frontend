import AppLayout from "./layouts/AppLayout";
import PageCreateCategory from "./pages/PageCreateCategory/PageCreateCategory";
import PageCreateEditSpeaker from "./pages/PageCreateEditSpeaker";
import PageCreateEditWebinar from "./pages/PageCreateEditWebinar";
import PageLogin from "./pages/PageLogin/PageLogin";
import PageOrderPanel from "./pages/PageOrderPanel/PageOrderPanel";
import PageSpeakerPanel from "./pages/PageSpeakerPanel";
import PageUnauthorizeError from "./pages/PageUnauthorizeError";
import PageWebinarPanel from "./pages/PageWebinarPanel";
import PageWebsiteConfig from "./pages/PageWebsiteConfig/PageWebsiteConfig";

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

const appChildrenRoutes = [
  {
    path: LINK_WEBINAR,
    element: <PageWebinarPanel />,
  },
  {
    path: LINK_SPEAKER,
    element: <PageSpeakerPanel />,
  },
  {
    path: LINK_ORDER,
    element: <PageOrderPanel />,
  },
  {
    path: LINK_CREATE_WEBINAR,
    element: <PageCreateEditWebinar />,
  },
  {
    path: `${LINK_EDIT_WEBINAR}/:webinarId`,
    element: <PageCreateEditWebinar />,
  },
  {
    path: LINK_CREATE_SPEAKER,
    element: <PageCreateEditSpeaker />,
  },
  {
    path: `${LINK_EDIT_SPEAKER}/:speakerId`,
    element: <PageCreateEditSpeaker />,
  },
  {
    path: `${LINK_INDUSTRY}`,
    element: <PageCreateCategory />,
  },
  {
    path: `${LINK_WEBSITE}`,
    element: <PageWebsiteConfig />,
  },
];

const routes = [
  {
    path: LINK_ROOT,
    element: <PageLogin />,
    errorElement: <PageUnauthorizeError />,
  },
  {
    path: LINK_DASHBOARD,
    element: <AppLayout />,
    children: appChildrenRoutes,
  },
];

export default routes;
