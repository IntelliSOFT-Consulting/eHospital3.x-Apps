import React from "react";
import {
  useMessages,
  sendPatientMessage,
  resendAllMessages,
} from "../../hooks/useMessages";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../messages-datatable/messages-table.component";
import { Button } from "@carbon/react";
import EmptyState from "../empty-state/empty-state.component";

const AppointmentMessage = () => {
  const messages = useMessages();

  const headers: TableHeaderItem[] = [
    { key: "date", header: "Date" },
    { key: "name", header: "Name" },
    { key: "phoneNo", header: "Phone No." },
    { key: "message", header: "Message" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action" },
    { key: "fullMessage", header: "Full Message" },
    { key: "sentTimestamp", header: "Sent Time" },
    { key: "patientUuid", header: "Patient Uuid" },
  ];

  const rows: TableRowItem[] = messages.map((msg) => {
    return {
      id: msg.id,
      patientUuid: msg.patientUuid,
      name: msg.name,
      date: msg.date,
      phoneNo: msg.phoneNo,
      message: msg.message,
      fullMessage: msg.fullMessage,
      status: msg.status,
      sentTimestamp: msg.sentTimestamp,
    };
  });

  const onResend = async (patientUuid) => {
    try {
      await sendPatientMessage(patientUuid);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onResendAll = async () => {
    try {
      await resendAllMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div>
        {rows.length > 0 && (
          <Button onClick={onResendAll}>Resend All Texts</Button>
        )}
      </div>

      {rows.length === 0 && (
        <CustomDataTable headers={headers} rows={rows} onResend={onResend} />
      )}
      {rows.length === 0 && <EmptyState />}
    </>
  );
};

export default AppointmentMessage;
