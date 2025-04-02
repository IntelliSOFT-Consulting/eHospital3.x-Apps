import React, { useState, useMemo } from "react";
import {
  useMessages,
  sendPatientMessage,
  resendAllMessages,
} from "../../hooks/useMessages";
import {
  useDebounce,
  useLayoutType,
  usePagination,
} from "@openmrs/esm-framework";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../messages-datatable/messages-table.component";
import { Button, Search, Pagination } from "@carbon/react";
import { useTranslation } from "react-i18next";
import EmptyState from "../empty-state/empty-state.component";
import styles from "./appointment-message-table.scss";
import { usePaginationInfo } from "@openmrs/esm-patient-common-lib";

const AppointmentMessage = () => {
  const { messages, mutate } = useMessages();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const responsiveSize = useLayoutType() !== "tablet" ? "sm" : "md";
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const headers: TableHeaderItem[] = [
    { key: "date", header: "Date" },
    { key: "phoneNo", header: "Phone No." },
    { key: "message", header: "Message" },
    { key: "status", header: "Status" },
    { key: "scheduledDate", header: "Scheduled Date" },
    { key: "action", header: "Action" },
    { key: "fullMessage", header: "Full Message" },
    { key: "timeSent", header: "Time Sent" },
    { key: "patientUuid", header: "Patient Uuid" },
  ];

  const rows: TableRowItem[] = messages.map((msg) => {
    return {
      id: msg.id,
      patientUuid: `${msg.patientUuid} - ${msg.date}`,
      date: msg.date,
      phoneNo: msg.phoneNo,
      message: msg.message,
      fullMessage: msg.fullMessage,
      status: msg.status,
      scheduledDate: msg.scheduledDate,
      timeSent: msg.timeSent,
    };
  });

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

  const onResend = async (patientUuid) => {
    try {
      await sendPatientMessage(patientUuid);
      await mutate();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onResendAll = async () => {
    try {
      await resendAllMessages();
      await mutate();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div className={styles.messageContainer}>
        <Search
          size={responsiveSize}
          placeholder={t("searchMessages", "Search messages")}
          labelText={t("searchLabel", "Search")}
          closeButtonLabelText={t("clearSearch", "Clear search input")}
          id="search-1"
          onChange={(event) => handleSearch(event.target.value)}
        />
        {filteredRows.length > 0 && (
          <Button className={styles.resendMessagesButton} onClick={onResendAll}>
            Resend All Texts
          </Button>
        )}
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

export default AppointmentMessage;
