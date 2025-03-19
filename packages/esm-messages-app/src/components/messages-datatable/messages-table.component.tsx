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
  Tag,
} from "@carbon/react";
import { Renew, Warning } from "@carbon/react/icons";
import FullMessageComponent from "../full-message/full-message.component";
import styles from "./messages-table.scss";

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
  const pickTagClassname = (status: string) => {
    switch (status?.toLowerCase()) {
      case "sent":
        return "greenTag";
      case "failed":
        return "redTag";
      case "scheduled":
        return "mustardTAg";
      case "not sent":
        return "redTag";
      default:
        return "tag";
    }
  };

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getExpandedRowProps,
        }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader aria-label="expand row" />
                  {headers
                    .filter(
                      (header) =>
                        header.key !== "fullMessage" &&
                        header.key !== "patientUuid"
                    )
                    .map((header) => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({ header })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  <TableHeader aria-label="overflow actions" />
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
                    (cell) => cell.info.header === "timeSent"
                  );
                  const patientUuidCell = row.cells.find(
                    (cell) => cell.info.header === "patientUuid"
                  );

                  const rowStatus = statusCell?.value;

                  return (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => {
                          if (cell.info.header === "action") {
                            return (
                              <TableCell key={cell.id}>
                                {["NOT SENT", "FAILED"].includes(rowStatus) && (
                                  <>
                                    <Button
                                      kind="danger--tertiary"
                                      renderIcon={Renew}
                                      size="sm"
                                      hasIconOnly
                                      iconDescription="Resend message"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onResend?.(patientUuidCell?.value);
                                      }}
                                    />
                                    <Button
                                      renderIcon={Warning}
                                      hasIconOnly
                                      size="sm"
                                      iconDescription="More Info"
                                      kind="danger"
                                      style={{ marginLeft: "2rem" }}
                                    />
                                  </>
                                )}
                              </TableCell>
                            );
                          }

                          if (cell.info.header === "status") {
                            return (
                              <TableCell key={cell.id}>
                                <Tag
                                  className={
                                    styles[pickTagClassname(cell.value)]
                                  }
                                >
                                  {cell.value}
                                </Tag>
                              </TableCell>
                            );
                          }

                          if (cell.info.header === "fullMessage") {
                            return null;
                          }

                          if (cell.info.header === "patientUuid") {
                            return null;
                          }

                          return (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          );
                        })}
                      </TableExpandRow>

                      {row.isExpanded && (
                        <TableExpandedRow
                          colSpan={headers.length + 1}
                          className="demo-expanded-td"
                          {...getExpandedRowProps({ row })}
                        >
                          <FullMessageComponent
                            message={messageCell?.value}
                            timestamp={timeStampCell?.value}
                          />
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
    </>
  );
};

export default CustomDataTable;
