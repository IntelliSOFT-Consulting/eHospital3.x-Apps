import React, { useState } from "react";
import styles from "./styles/index.scss";
import ImportExportIllustrationComponent from "../components/import-export-illustration.component";
import { useTranslation } from "react-i18next";
import MetricCardComponent from "../components/metric-card.component";
import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  Tooltip,
} from "@carbon/react";
import { dummyBackupTableData } from "../data/dummy";
import { useBackup } from "../hooks/useBackup";
import DownloadModalComponent from "../components/modals/download-modal.component";
import DeleteModalComponent from "../components/modals/delete-modal.component";
import NewBackupModal from "../components/modals/new-backup.component";
import RetryModalComponent from "../components/modals/retry-modal.component";
import ImportModalComponent from "../components/modals/import-modal.component";
import InfoModalComponent from "../components/modals/info-modal.component";
import {
  Download,
  Information,
  TrashCan,
  RetryFailed,
} from "@carbon/react/icons";

interface tableHeader {
  key: string;
  header: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const {
    tableHeaders,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    setIsDeleteModalOpen,
    isDeleteModalOpen,
    setIsNewModalOpen,
    isNewModalOpen,
    isRetryModalOpen,
    setIsRetryModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isInfoModalOpen,
    setIsInfoModalOpen,
  } = useBackup();

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleOpenInfoModal = (rowId: string) => {
    setSelectedRowId(rowId);
    setIsInfoModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <ImportExportIllustrationComponent />
        <div className={styles.headerTextWrapper}>
          <p className={styles.headerSubText}>
            {t("importExport", "Import Export")}
          </p>
          <p className={styles.headerTitle}>{t("home", "Home")}</p>
        </div>
      </div>

      <div className={styles.body}>
        <MetricCardComponent
          stat={new Date().toLocaleString()}
          title={t("dateOfLastBackup", "Date of last backup")}
        />

        <div className={styles.datatableWrapper}>
          <DataTable
            rows={dummyBackupTableData}
            headers={tableHeaders}
            render={({
              rows,
              headers,
              getHeaderProps,
              getTableProps,
              getRowProps,
              getTableContainerProps,
              getToolbarProps,
            }) => (
              <TableContainer title="Backup History">
                <TableToolbar {...getToolbarProps()}>
                  <TableToolbarContent>
                    <Button
                      onClick={() => setIsImportModalOpen(true)}
                      size="sm"
                      className={styles.importButton}
                    >
                      Import Backup
                    </Button>
                    <Button
                      onClick={() => setIsNewModalOpen(true)}
                      size="sm"
                      className={styles.newButton}
                      kind="primary"
                    >
                      New Backup
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header: tableHeader) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader>Actions</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                        <TableCell className={styles.actionCell}>
                          {row.cells.find(
                            (cell) => cell.info.header === "status"
                          ).value === "completed" ? (
                            <Tooltip label="Download">
                              <Button
                                onClick={() => setIsDownloadModalOpen(true)}
                                className={styles.actionButton}
                                size="sm"
                              >
                                <Download size={20} />
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip label="Retry">
                              <Button
                                onClick={() => setIsRetryModalOpen(true)}
                                className={styles.actionButton}
                                size="sm"
                              >
                                <RetryFailed size={20} />
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip label="Delete">
                            <Button
                              onClick={() => setIsDeleteModalOpen(true)}
                              className={styles.actionButton}
                              size="sm"
                              kind="danger"
                            >
                              <TrashCan size={20} />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            label="More Info"
                            enterDelayMs={0}
                            leaveDelayMs={300}
                          >
                            <Button
                              onClick={() => handleOpenInfoModal(row.id)}
                              className={styles.actionButton}
                              kind="secondary"
                              size="sm"
                            >
                              <Information size={20} />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          />
        </div>
      </div>
      <DeleteModalComponent
        isOpen={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
      />
      <DownloadModalComponent
        isOpen={isDownloadModalOpen}
        setOpen={setIsDownloadModalOpen}
      />
      <NewBackupModal isOpen={isNewModalOpen} setOpen={setIsNewModalOpen} />
      <RetryModalComponent
        isOpen={isRetryModalOpen}
        setOpen={setIsRetryModalOpen}
      />
      <ImportModalComponent
        isOpen={isImportModalOpen}
        setOpen={setIsImportModalOpen}
      />
      {selectedRowId && (
        <InfoModalComponent
          isOpen={isInfoModalOpen}
          setOpen={setIsInfoModalOpen}
          rowId={selectedRowId}
        />
      )}
    </div>
  );
};

export default Home;
