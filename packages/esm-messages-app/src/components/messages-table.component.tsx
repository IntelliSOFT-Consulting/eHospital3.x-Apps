import React, { FC } from "react";
import {
  DataTable,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow,
  Button,
  Tag
} from "@carbon/react";
import { Renew } from "@carbon/react/icons";
import FullMessageComponent from "./full-message/full-message.component";

export interface TableHeaderItem {
  key: string;
  header: string;
}

export interface TableRowItem {
  id: string;
  [key: string]: any;
}

interface CustomDataTableProps {
  headers: TableHeaderItem[];
  rows: TableRowItem[];
  onResend?(rowId: string): void;
}

const CustomDataTable: FC<CustomDataTableProps> = ({
  headers,
  rows,
  onResend,
}) => {

  function getTagType(status: string): string {
    switch (status?.toLowerCase()) {
      case "sent":
        return "green";
      case "failed":
        return "red";
      case "scheduled":
        return "#ffbff00";
      default:
        return "gray";
    }
  }
  

  return (
    <DataTable rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getTableContainerProps,
        getExpandedRowProps,
      }) => (
        <TableContainer {...getTableContainerProps()}>
          <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              <TableExpandHeader />
              {headers
                .filter((header) => header.key !== "fullMessage" && header.key !== "sentTimestamp" && header.key !== "patientUuid") // Hide the column
                .map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
            </TableRow>
          </TableHead>

            <TableBody>
              {rows.map((row) => {
                const statusCell = row.cells.find(
                  (cell) => cell.info.header === "status"
                );
                const messageCell = row.cells.find(
                  (cell) => cell.info.header === "fullMessage"
                );
                const timeStampCell = row.cells.find(
                  (cell) => cell.info.header === "sentTimestamp"
                );
                const patientUuidCell = row.cells.find(
                  (cell) => cell.info.header === "patientUuid"
                );

                const rowStatus = statusCell?.value;

                return (
                  <React.Fragment key={row.id}>
                    <TableExpandRow
                      {...getRowProps({ row })}
                    >
                      {row.cells.map((cell) => {
                        if (cell.info.header === "action") {
                          return (
                            <TableCell key={cell.id}>
                              {rowStatus === "FAILED" && (
                                <Button
                                  kind="danger--tertiary"
                                  renderIcon = {Renew}
                                  size="sm"
                                  hasIconOnly
                                  iconDescription="Resend message"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onResend?.(patientUuidCell?.value);
                                  }}
                                />
                              )}
                            </TableCell>
                          );
                        }

                        if (cell.info.header === "status") {
                          return (
                            <TableCell key={cell.id}>
                              <Tag type={getTagType(cell.value)}>{cell.value}</Tag>
                            </TableCell>
                          );
                        }

                        if (cell.info.header === "fullMessage") {
                          return null;
                        }

                        if (cell.info.header === "sentTimestamp") {
                          return null;
                        }

                        if (cell.info.header === "patientUuid") {
                          return null;
                        }

                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                      })}
                    </TableExpandRow>

                    {row.isExpanded && (
                      <TableExpandedRow
                        colSpan={headers.length + 1}
                        className="demo-expanded-td"
                        {...getExpandedRowProps({ row })}
                      >
                        <FullMessageComponent message={messageCell?.value} timestamp={timeStampCell?.value} />
                      </TableExpandedRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export default CustomDataTable;
