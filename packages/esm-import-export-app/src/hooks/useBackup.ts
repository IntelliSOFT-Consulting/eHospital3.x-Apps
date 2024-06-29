import {useState} from "react";

export const useBackup = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

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
  ]

  return {
    tableHeaders,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
  }
}
