import React, { useMemo } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface DashboardLinkConfig {
  name: string;
  title: string;
}

export function DashboardExtension({
  dashboardLinkConfig,
}: {
  dashboardLinkConfig: DashboardLinkConfig;
}) {
  const { t } = useTranslation();
  const { name, title } = dashboardLinkConfig;
  const location = useLocation();
  const spaBasePath = `${window.spaBase}/home`;

  const navLink = useMemo(() => {
    const pathArray = location.pathname.split("/home");
    const lastElement = pathArray[pathArray.length - 1];
    return decodeURIComponent(lastElement);
  }, [location.pathname]);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const reportsUrl = `${baseUrl}/openmrs/spa/reports`;

  const handleClick = () => {
    const url = name === "reports" ? reportsUrl : `${spaBasePath}/${name}`;
    window.open(url, "_blank");
  };

  return (
    <button
      className={`cds--side-nav__link ${
        navLink.match(name) && "active-left-nav-link"
      }`}
      style={{
        paddingLeft: "50px",
        lineHeight: "inherit",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: "0",
        marginLeft: "17px",
        fontSize: "15px",
        color: "inherit",
      }}
      onClick={handleClick}
    >
      {t(name, title)}
    </button>
  );
}

export const createDashboardLink =
  (dashboardLinkConfig: DashboardLinkConfig) => () =>
    (
      <BrowserRouter>
        <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
      </BrowserRouter>
    );
