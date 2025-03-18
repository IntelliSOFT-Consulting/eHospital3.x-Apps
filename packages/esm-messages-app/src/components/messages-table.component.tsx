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
        getExpandedRowProps,
      }) => (
        <TableContainer>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                <TableExpandHeader aria-label="expand row" />
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
                <TableHeader aria-label="overflow actions" />
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableExpandRow>
                  <TableExpandedRow
                    colSpan={headers.length + 1}
                    {...getExpandedRowProps({ row })}
                  />
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export default CustomDataTable;
