import React, { useMemo, useState } from "react";
import styles from "./groupedOrdersTable.scss";
import { useTranslation } from "react-i18next";
import { formatDate, parseDate, usePagination } from "@openmrs/esm-framework";
import { useSearchGroupedResults } from "../hooks/useSearchGroupedResults";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableExpandedRow,
  TableExpandHeader,
  TableCell,
  DataTable,
  Pagination,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Layer,
  Dropdown,
  DatePicker,
  DatePickerInput,
} from "@carbon/react";
import ListOrderDetails from "./listOrderDetails.component";
import Overlay from "../components/overlay/overlay.component";
import { GroupedOrdersTableProps, OrderStatusFilterType } from "../types";

//  render Grouped by patient Orders in procedures app
const GroupedOrdersTable: React.FC<GroupedOrdersTableProps> = (props) => {
  const workListEntries = props.orders;
  const { t } = useTranslation();
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [searchString, setSearchString] = useState<string>("");
  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState("");

  const OrderStatuses = [
    "All",
    "RECEIVED",
    "IN_PROGRESS",
    "COMPLETED",
    "EXCEPTION",
    "ON_HOLD",
    "DECLINED",
  ];

  const [filter, setFilter] = useState<OrderStatusFilterType>("All");

  const filteredEntries = useMemo(() => {
    if (!filter || filter == "All") {
      return workListEntries;
    }

    if (filter) {
      return workListEntries?.filter(
        (order) => order.fulfillerStatus === filter
      );
    }

    return workListEntries;
  }, [filter, workListEntries]);

  const handleOrderStatusChange = ({ selectedItem }) => setFilter(selectedItem);

  function groupOrdersById(orders) {
    if (orders && orders.length > 0) {
      const groupedOrders = orders.reduce((acc, item) => {
        if (!acc[item.patient.uuid]) {
          acc[item.patient.uuid] = [];
        }
        acc[item.patient.uuid].push(item);
        return acc;
      }, {});

      // Convert the result to an array of objects with patientId and orders
      return Object.keys(groupedOrders).map((patientId) => ({
        patientId: patientId,
        orders: groupedOrders[patientId],
      }));
    } else {
      return [];
    }
  }
  const groupedOrdersByPatient = groupOrdersById(filteredEntries);
  const searchResults = useSearchGroupedResults(
    groupedOrdersByPatient,
    searchString
  );
  const {
    goTo,
    results: paginatedResults,
    currentPage,
  } = usePagination(searchResults, currentPageSize);

  const pageSizes = [10, 20, 30, 40, 50];

  const rowsData = useMemo(() => {
    return paginatedResults.map((patient) => ({
      id: patient.patientId,
      patientName: patient.orders[0].patient?.display?.split("-")[1],
      orders: patient.orders,
      totalOrders: patient.orders?.length,
    }));
  }, [paginatedResults]);

  const tableColumns = [
    { id: 0, header: t("patient", "Patient"), key: "patientName" },
    { id: 1, header: t("totalorders", "Total Orders"), key: "totalOrders" },
  ];
  return (
    <div>
      <DataTable
        rows={rowsData}
        headers={tableColumns}
        useZebraStyles
        overflowMenuOnHover={true}
      >
        {({
          rows,
          headers,
          getHeaderProps,
          getTableProps,
          getRowProps,
          onInputChange,
        }) => (
          <TableContainer className={styles.tableContainer}>
            <TableToolbar
              style={{
                position: "static",
              }}
            >
              <TableToolbarContent>
                {props.showStatusFilter && (
                  <Layer style={{ margin: "5px" }}>
                    <Dropdown
                      id="orderStatus"
                      initialSelectedItem={"All"}
                      label=""
                      titleText={
                        t("filterOrdersByStatus", "Filter orders by status") +
                        ":"
                      }
                      type="inline"
                      items={OrderStatuses}
                      onChange={handleOrderStatusChange}
                    />
                  </Layer>
                )}
                {props.showDateFilter && (
                  <Layer style={{ margin: "5px" }}>
                    <DatePicker dateFormat="Y-m-d" datePickerType="single">
                      <DatePickerInput
                        labelText={""}
                        id="activatedOnOrAfterDate"
                        placeholder="YYYY-MM-DD"
                        onChange={(event) => {
                          setActivatedOnOrAfterDate(event.target.value);
                        }}
                        type="date"
                        value={activatedOnOrAfterDate}
                      />
                    </DatePicker>
                  </Layer>
                )}
                <Layer style={{ margin: "5px" }}>
                  <TableToolbarSearch
                    expanded
                    onChange={onInputChange}
                    placeholder={t("searchThisList", "Search this list")}
                    size="sm"
                  />
                </Layer>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} className={styles.activePatientsTable}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader />
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.id.endsWith("created")
                              ? formatDate(parseDate(cell.value))
                              : cell.value}
                          </TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <ListOrderDetails
                          actions={props.actions}
                          groupedOrders={groupedOrdersByPatient.find(
                            (item) => item.patientId === row.id
                          )}
                          showActions={props.showActions}
                          showOrderType={props.showOrderType}
                          showStatus={props.showStatus}
                        />
                      </TableExpandedRow>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={headers.length + 1}
                      style={{ textAlign: "center" }}
                      className={styles.noOrdersDiv}
                    >
                      {t("noOrderAvailable", "No orders available")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Pagination
              forwardText="Next page"
              backwardText="Previous page"
              page={currentPage}
              pageSize={currentPageSize}
              pageSizes={pageSizes}
              totalItems={filteredEntries?.length}
              className={styles.pagination}
              onChange={({ pageSize, page }) => {
                if (pageSize !== currentPageSize) {
                  // setPageSize(pageSize);
                }
                if (page !== currentPage) {
                  goTo(page);
                }
              }}
            />
          </TableContainer>
        )}
      </DataTable>
      <Overlay />
    </div>
  );
};

export default GroupedOrdersTable;
