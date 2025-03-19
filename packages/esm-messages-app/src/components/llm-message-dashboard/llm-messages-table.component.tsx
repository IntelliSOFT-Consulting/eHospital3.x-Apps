import React, { useState, useMemo } from "react";
import { useLLMMessages, resendMessage } from "../../hooks/useLLMMessage";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../messages-datatable/messages-table.component";
import EmptyState from "../empty-state/empty-state.component";
import { Search } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@openmrs/esm-framework";
import { DateRangePicker } from "../filters/date-range-filter";

const LlmDataTable = () => {
  const size = "md";
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);

  const messages = useLLMMessages(dateRange[0], dateRange[1]);

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

  const rows: TableRowItem[] = messages.map((msg) => {
    return {
      id: `${msg.id} - ${msg.date}`,
      patientUuid: msg.id,
      date: msg.date,
      patientName: msg.name,
      message: msg.statusMessage,
      fullMessage: msg.fullMessage,
      status: msg.status,
      timeSent: msg.timeSent,
    };
  });

  const filterdRows = useMemo(() => {
    return (
      rows.filter((row) =>
        row.patientName
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      ) ?? []
    );
  }, [rows, debouncedSearchTerm]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const onResend = async (patientUuid) => {
    try {
      await resendMessage(patientUuid);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Search
          size={size}
          placeholder={t("searchMessages", "Search messages")}
          labelText={t("searchLabel", "Search")}
          closeButtonLabelText={t("clearSearch", "Clear search input")}
          id="search-1"
          onChange={(event) => handleSearch(event.target.value)}
        />
        <DateRangePicker onDateChange={setDateRange} />
      </div>
      <CustomDataTable
        headers={headers}
        rows={filterdRows}
        onResend={onResend}
      />
      <div>
        {rows.length === 0 && (
          <div>
            <EmptyState />
          </div>
        )}
      </div>
    </>
  );
};

export default LlmDataTable;
