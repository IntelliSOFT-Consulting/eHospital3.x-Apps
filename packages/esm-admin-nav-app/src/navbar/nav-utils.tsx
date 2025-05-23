import React from "react";
import {
  DocumentAdd,
  Events,
  Medication,
  Receipt,
  Renew,
  User,
  Report,
  ImportExport,
  HospitalBed,
  Chat,
  Microscope,
  FolderAdd,
  DocumentTasks,
} from "@carbon/react/icons";
const openmrsSpaBase = window["getOpenmrsSpaBase"]();

const handleClearCache = async () => {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};

export const moduleLinks = [
  {
    label: "Clear Cache",
    icon: <Renew size={24} />,
    onClick: handleClearCache,
  },
  {
    label: "Form Builder ",
    url: `${openmrsSpaBase}form-builder`,
    icon: <DocumentAdd size={24} />,
  },
  {
    label: "Fast Data Entry ",
    url: `${openmrsSpaBase}forms`,
    icon: <FolderAdd size={24} />,
  },
  {
    label: "Legacy Admin ",
    url: `/openmrs/index.htm`,
    icon: <User size={24} />,
  },
  {
    label: "Form Render ",
    url: `${openmrsSpaBase}form-render-test`,
    icon: <DocumentTasks size={24} />,
  },
  {
    label: "Manage Stocks ",
    url: `${openmrsSpaBase}stock-management`,
    icon: <Report size={24} />,
  },
  {
    label: "Billing ",
    url: `${openmrsSpaBase}billing`,
    icon: <Receipt size={24} />,
  },
  {
    label: "Cohort Builder ",
    url: `${openmrsSpaBase}cohort-builder`,
    icon: <Events size={24} />,
  },
  {
    label: "Bed Management",
    url: `${openmrsSpaBase}bed-management`,
    icon: <HospitalBed size={24} />,
  },
  {
    label: "Dispensing App",
    url: `${openmrsSpaBase}dispensing`,
    icon: <Medication size={24} />,
  },
  {
    label: "Backup Services",
    url: `${openmrsSpaBase}home/import-export`,
    icon: <ImportExport size={24} />,
    requiresAdmin: true,
  },
  {
    label: "Messages",
    url: `${openmrsSpaBase}messages`,
    icon: <Chat size={24} />,
    requiresAdmin: true,
  },
  {
    label: "OCL",
    url: `${openmrsSpaBase}ocl`,
    icon: <Microscope size={24} />,
    requiresAdmin: true,
  },
];
