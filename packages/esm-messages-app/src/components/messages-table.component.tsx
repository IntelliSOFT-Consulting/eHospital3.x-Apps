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
} from "@carbon/react";
import { Renew } from "@carbon/react/icons";

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
  const handleRowClick = (rowId: string) => {
    if (onResend) {
      onResend(rowId);
    }
  };

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
                {headers.map((header) => (
                  <TableHeader
                    key={header.key}
                    {...getHeaderProps({ header })}
                  >
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

                const rowStatus = statusCell?.value;

                return (
                  <React.Fragment key={row.id}>
                    <TableExpandRow
                      {...getRowProps({ row })}
                      onClick={() => handleRowClick(row.id)}
                    >
                      {row.cells.map((cell) => {
                        if (cell.info.header === "action") {
                          return (
                            <TableCell key={cell.id}>
                              {rowStatus === "failed" && (
                                <Button
                                  kind="danger--tertiary"
                                  renderIcon = {Renew}
                                  size="sm"
                                  hasIconOnly
                                  iconDescription="Resend message"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onResend?.(row.id);
                                  }}
                                />
                              )}
                            </TableCell>
                          );
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
                        <p>Expanded data goes here...</p>
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
