import React, { useState, useMemo } from "react";
import { resendMessage } from "../../hooks/useLLMMessage";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../messages-datatable/messages-table.component";
import EmptyState from "../empty-state/empty-state.component";
import { Search, Pagination, DataTableSkeleton } from "@carbon/react";
import { useTranslation } from "react-i18next";
import {
  useDebounce,
  usePagination,
  useLayoutType,
} from "@openmrs/esm-framework";
import { usePaginationInfo } from "@openmrs/esm-patient-common-lib";
import { useDateFilterContext } from "../filters/useFilterContext";

const LlmDataTable = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const responsiveSize = useLayoutType() !== "tablet" ? "sm" : "md";
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { messages, isLoading, mutate } = useDateFilterContext();

  const headers: TableHeaderItem[] = [
    { key: "date", header: "Date" },
    { key: "patientName", header: "Patient Name" },
    { key: "message", header: "Message" },
    { key: "status", header: "Status" },
    { key: "timeSent", header: "Time Sent" },
    { key: "action", header: "Action" },
    { key: "fullMessage", header: "Full Message" },
    { key: "patientUuid", header: "Patient Uuid" },
  ];

  const rows: TableRowItem[] = messages.map((msg) => ({
    id: `${msg.id} - ${msg.date}`,
    patientUuid: msg.id,
    date: msg.date,
    patientName: msg.name,
    message: msg.statusMessage,
    fullMessage: msg.fullMessage,
    status: msg.status,
    timeSent: msg.timeSent,
  }));

  const { currentPage, goTo, results } = usePagination(rows, pageSize);

  const filteredRows = useMemo(() => {
    return (
      results.filter((row) =>
        row.patientName
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      ) ?? []
    );
  }, [results, debouncedSearchTerm]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const { pageSizes } = usePaginationInfo(
    pageSize,
    rows.length,
    currentPage,
    results.length
  );

  const onResend = async (patientUuid: string) => {
    try {
      await resendMessage(patientUuid);
      await mutate();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) {
    return (
      <DataTableSkeleton
        headers={headers}
        aria-label="sample table"
        showHeader={false}
        showToolbar={false}
      />
    );
  }

  return (
    <>
      <div>
        <Search
          size={responsiveSize}
          placeholder={t("searchMessages", "Search messages")}
          labelText={t("searchLabel", "Search")}
          closeButtonLabelText={t("clearSearch", "Clear search input")}
          id="search-1"
          onChange={(event) => handleSearch(event.target.value)}
        />
      </div>
      <CustomDataTable
        headers={headers}
        rows={filteredRows}
        onResend={onResend}
      />
      {pageSizes.length > 1 && (
        <Pagination
          forwardText={"Next page"}
          backwardText={"Previous page"}
          page={currentPage ?? 1}
          pageSize={pageSize ?? 5}
          pageSizes={pageSizes}
          totalItems={rows.length ?? 0}
          size={responsiveSize}
          onChange={({ page: newPage, pageSize }) => {
            if (newPage !== currentPage) {
              goTo(newPage);
            }
            setPageSize(pageSize);
          }}
        />
      )}
      {results.length === 0 && <EmptyState />}
    </>
  );
};

export default LlmDataTable;
