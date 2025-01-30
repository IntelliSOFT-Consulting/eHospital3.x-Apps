import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
} from "@carbon/react";
import styles from "./messages-dashboard.scss";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../components/messages-table.component";
import MessageIllustration from "../messages-header/message-illustration.component";
import MessagesHeader from "../messages-header/messages-header.component";

const MessagesDashboard: React.FC = () => {
  const { t } = useTranslation();

  const headers: TableHeaderItem[] = [
    { key: "date", header: "Date" },
    { key: "phoneNo", header: "Phone No." },
    { key: "message", header: "Message" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action" },
  ];

  const rows: TableRowItem[] = [
    {
      id: "1",
      date: "2025-01-01",
      phoneNo: "123-456-7890",
      message: "Appointment reminder.",
      status: "sent",
      details: "Appointment reminder details here...",
    },
    {
      id: "2",
      date: "2025-01-02",
      phoneNo: "234-567-8901",
      message: "Checkup follow-up.",
      status: "failed",
      details: "Failed follow-up. Possibly invalid phone number.",
    },
    {
      id: "3",
      date: "2025-01-03",
      phoneNo: "345-678-9012",
      message: "Vaccination schedule.",
      status: "failed",
      details: "Vaccination schedule details here...",
    },
    {
      id: "4",
      date: "2025-01-04",
      phoneNo: "456-789-0123",
      message: "Billing information.",
      status: "failed",
      details: "Billing info message not delivered, consider resending.",
    },
  ];

  const periodFilterItems = [
    { text: "Today" },
    { text: "Last one week" },
    { text: "Last one month" },
  ];

	const statusFilterItems = [
		{ text: "All" },
		{ text: "Sent" },
		{ text: "Failed" }
	]

  const onResend = (rowId: string) => {
    console.log("Resend triggered for row with id:", rowId);
  };

  return (
    <>
			<MessagesHeader title={t('home', 'Home')} />

      <div className={styles.tableContainer}>
        <div>
          <Dropdown
            titleText="Filter by period: "
            initialSelectedItem={periodFilterItems[0]}
            items={periodFilterItems}
            itemToString={(item) => (item ? item.text : "")}
            type="inline"
						className={styles.filter}
          />

					<Dropdown
            titleText="Filter by status: "
            initialSelectedItem={statusFilterItems[0]}
            items={statusFilterItems}
            itemToString={(item) => (item ? item.text : "")}
            type="inline"
						className={styles.filter}
          />
        </div>

        <CustomDataTable headers={headers} rows={rows} onResend={onResend} />
      </div>
    </>
  );
};

export default MessagesDashboard;
