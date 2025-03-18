import React from "react";
import { useLLMMessages, resendMessage } from "../../hooks/useLLMMessage";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../messages-datatable/messages-table.component";
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

  const onResend = async (patientUuid) => {
    try {
      await resendMessage(patientUuid);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <CustomDataTable headers={headers} rows={rows} onResend={onResend} />
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
