import { useState } from "react";

export const useBackup = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isRetryModalOpen, setIsRetryModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const tableHeaders = [
    {
      key: "date",
      header: "Date",
    },
    {
      key: "user",
      header: "User",
    },
    {
      key: "status",
      header: "Status",
    },
  ];

  return {
    tableHeaders,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isNewModalOpen,
    setIsNewModalOpen,
    setIsRetryModalOpen,
    isRetryModalOpen,
    setIsImportModalOpen,
    isImportModalOpen,
    isInfoModalOpen,
    setIsInfoModalOpen,
  };
};
