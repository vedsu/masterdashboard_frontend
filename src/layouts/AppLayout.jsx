/* eslint-disable react/prop-types */
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import AuthValidator from "../components/AuthValidator";
import { primeReactConfigOptions } from "../constants/primeReact";
import {
  LINK_DASHBOARD,
  LINK_INDUSTRY,
  LINK_ORDER,
  LINK_ROOT,
  LINK_SPEAKER,
  LINK_WEBINAR,
  LINK_WEBSITE,
} from "../routes";
import "../styles/appLayout.css";

const AppLayout = () => {
  const location = useLocation();

  const [loginBtnLoader, setLoginBtnLoader] = useState(false);

  if (
    location.pathname === LINK_DASHBOARD ||
    location.pathname === `${LINK_DASHBOARD}/`
  ) {
    window.location.href = LINK_WEBINAR;
  }

  const sideMenuNavLinks = [
    {
      key: "WEBINAR",
      label: "Webinar",
      icon: "",
      destinationRoute: LINK_WEBINAR,
      isActive: location.pathname.includes(LINK_WEBINAR),
    },
    {
      key: "SPEAKER",
      label: "Speaker",
      icon: "",
      destinationRoute: LINK_SPEAKER,
      isActive: location.pathname.includes(LINK_SPEAKER),
    },
    {
      key: "ORDER",
      label: "Order",
      icon: "",
      destinationRoute: LINK_ORDER,
      isActive: location.pathname.includes(LINK_ORDER),
    },
    {
      key: "INDUSTRY",
      label: "Industry",
      icon: "",
      destinationRoute: LINK_INDUSTRY,
      isActive: location.pathname.includes(LINK_INDUSTRY),
    },
    {
      key: "WEBSITE",
      label: "Website",
      icon: "",
      destinationRoute: LINK_WEBSITE,
      isActive: location.pathname.includes(LINK_WEBSITE),
    },
  ];

  const onLogout = () => {
    setLoginBtnLoader(true);
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = LINK_ROOT;
    }, 1000);
  };

  return (
    <AuthValidator>
      <PrimeReactProvider value={primeReactConfigOptions}>
        <div className="app-layout">
          <div className="side-nav">
            <ul className="side-nav-list p-fluid">
              {sideMenuNavLinks.map((navLink) => (
                <li key={navLink.key} className="side-nav-item mt-3">
                  <Link
                    to={navLink.destinationRoute}
                    className={`flex m-1 justify-center  text-white ${
                      navLink.isActive
                        ? "ring-[0.5px] ring-primary-light-900 bg-[#1c354e]"
                        : ""
                    }`}
                  >
                    {navLink.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="my-5 mx-1 text-center flex items-center justify-center hover:bg-[#1c354e] hover:ring-[0.5px] hover:ring-primary-light-900 hover:border-primary-light-900 relative"
              onClick={onLogout}
            >
              <span>Logout</span>
              {loginBtnLoader && (
                <i
                  className={`pi pi-spin pi-spinner absolute right-3`}
                  style={{ fontSize: "12px" }}
                ></i>
              )}
            </button>
          </div>

          <div className="app-content">
            <Outlet />
          </div>
        </div>
      </PrimeReactProvider>
    </AuthValidator>
  );
};

export default AppLayout;
