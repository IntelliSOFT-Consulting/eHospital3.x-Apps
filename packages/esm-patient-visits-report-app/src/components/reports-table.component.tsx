import React, {Dispatch, SetStateAction, useState} from "react";
import styles from "../home-dashboard/home-dashboard.scss";
import {
  DataTable,
  Layer,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile
} from "@carbon/react";
import {useTranslation} from "react-i18next";

interface tableProps {
  paginatedData: any;
  tableData: any;
  dateRange: {
    start: Date;
    end: Date,
  },
  rowData: any;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setItemsPerPage: Dispatch<SetStateAction<number>>
}


const ReportsTableComponent: React.FC<tableProps> = ({
  paginatedData, 
  tableData, 
  dateRange, 
  rowData,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage
}) => {
  const {t} = useTranslation();

  return (
    <div className={styles.datatable}>
      <DataTable
        useZebraStyles={true}
        rows={paginatedData}
        headers={tableData}
      >
        {({rows, headers, getRowProps, getTableProps}) => (
          <TableContainer {...getTableProps()} className={styles.table}>
            <Table className={styles.tableBody}>
              <TableHead>
                <TableRow>
                  {headers.map((col) => (
                    <TableHeader key={col.key}>{col.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (<TableRow
                    key={row.id}
                    {...getRowProps({row})}
                  >
                    {row.cells.map((cell, index) => (
                      <TableCell
                        key={index}>{typeof cell.value === 'function' ? cell.value() : cell.value}</TableCell>
                    ))}
                  </TableRow>)
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      {rowData?.length === 0 && (
        <div className={styles.emptyStateText}>
          <Layer level={0}>
            <Tile className={styles.emptyStateTile}>
              <p className={styles.filterEmptyStateContent}>
                {t('noData', 'No data to display. Please select a date range to fetch data.')}
              </p>
            </Tile>
          </Layer>
        </div>
      )}
      <Pagination
        totalItems={rowData.length}
        backwardText={t("previous", "Previous")}
        forwardText={t("next", "Next")}
        itemsPerPageText={t("itemsPerPage", "Items per page:")}
        page={currentPage}
        pageSize={itemsPerPage}
        pageSizes={[10, 20, 30, 40, 50]}
        onChange={({page, pageSize}) => {
          setCurrentPage(page);
          setItemsPerPage(pageSize);
        }}
      />
    </div>
  )
}

export default ReportsTableComponent
