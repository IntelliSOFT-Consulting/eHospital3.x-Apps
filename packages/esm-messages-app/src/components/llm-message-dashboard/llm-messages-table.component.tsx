import React from "react";
import { useLLMMessages } from "../../hooks/useLLMMessage";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../messages-table.component";
import EmptyState from "../empty-state/empty-state.component";

const LlmDataTable = () => {
  const messages = useLLMMessages();

  const headers: TableHeaderItem[] = [
    { key: "date", header: "Date" },
    { key: "patientName", header: "Patient Name" },
    { key: "message", header: "Message" },
    { key: "status", header: "Status" },
    { key: "timeSent", header: "Time Sent" },
    { key: "action", header: "Action" },
  ];

  const rows: TableRowItem[] = messages.map((msg) => {
    return {
      id: `${msg.id} - ${msg.date}`,
      date: msg.date,
      patientName: msg.name,
      message: msg.statusMessage,
      fullMessage: msg.fullMessage,
      status: msg.status,
      timeSent: msg.timeSent,
    };
  });

  return (
    <>
      <CustomDataTable headers={headers} rows={rows} />
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
