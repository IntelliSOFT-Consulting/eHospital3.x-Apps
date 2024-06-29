import React from 'react';
import styles from "./styles/index.scss"
import ImportExportIllustrationComponent from "../components/import-export-illustration.component";
import {useTranslation} from "react-i18next";
import MetricCardComponent from "../components/metric-card.component";
import {
  Button,
  DataTable,
  Table, TableBatchAction, TableBatchActions,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar, TableToolbarAction, TableToolbarContent, TableToolbarMenu, TableToolbarSearch
} from "@carbon/react";
import {dummyBackupTableData} from "../data/dummy";
import {useBackup} from "../hooks/useBackup";
import DownloadModalComponent from "../components/modals/download-modal.component";
import DeleteModalComponent from "../components/modals/delete-modal-component";
import {Add, Download, Save, TrashCan} from "@carbon/icons-react";

interface tableHeader {
  key: string;
  header: string;
}

const Home: React.FC = () => {
  const {t} = useTranslation()
  const {
    tableHeaders,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    setIsDeleteModalOpen,
    isDeleteModalOpen
  } = useBackup()


  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <ImportExportIllustrationComponent/>
        <div className={styles.headerTextWrapper}>
          <p className={styles.headerSubText}>{t("importExport", "Import Export")}</p>
          <p className={styles.headerTitle}>{t("home", "Home")}</p>
        </div>
      </div>

      <div className={styles.body}>
        <MetricCardComponent stat={new Date().toLocaleString()} title={t("dateOfLastBackup", "Date of last backup")}/>

        <div className={styles.datatableWrapper}>
          <DataTable
            rows={dummyBackupTableData}
            headers={tableHeaders}
            render={({rows, headers, getHeaderProps, getTableProps, getRowProps, getTableContainerProps, getToolbarProps}) => (
              <TableContainer title="Backup History">
                <TableToolbar {...getToolbarProps()} >
                  <TableToolbarContent >
                    <Button size="sm" className={styles.newButton} kind="primary">New Backup</Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header: tableHeader) => (
                        <TableHeader {...getHeaderProps({header})}>
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader>
                        Actions
                      </TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow {...getRowProps({row})}>
                        {row.cells.map((cell, index) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                        <TableCell className={styles.actionCell}>
                          {(row.cells.find(cell => cell.info.header === "status")).value === "completed" ? (
                            <Button onClick={() => setIsDownloadModalOpen(true)} className={styles.actionButton}
                                    size="sm">Download</Button>
                          ) : (
                            <Button className={styles.actionButton} size="sm">Retry</Button>
                          )}
                          <Button onClick={() => setIsDeleteModalOpen(true)} className={styles.actionButton} size="sm"
                                  kind="danger">Delete</Button>
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
      <DeleteModalComponent isOpen={isDeleteModalOpen} setOpen={setIsDeleteModalOpen}/>
      <DownloadModalComponent isOpen={isDownloadModalOpen} setOpen={setIsDownloadModalOpen}/>
    </div>
  );
};

export default Home;
