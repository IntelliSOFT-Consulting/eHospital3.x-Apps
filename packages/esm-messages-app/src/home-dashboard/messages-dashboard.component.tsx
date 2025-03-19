import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Layer,
} from "@carbon/react";
import styles from "./messages-dashboard.scss";
import MessagesHeader from "../messages-header/messages-header.component";
import LlmDataTable from "../components/llm-message-dashboard/llm-messages-table.component";
import AppointmentMessage from "../components/appointment-message-dashboard/appointment-message-table.component";

const MessagesDashboard: React.FC = () => {
  const { t } = useTranslation();

  const periodFilterItems = [
    { text: "Today" },
    { text: "Last one week" },
    { text: "Last one month" },
  ];

  const statusFilterItems = [
    { text: "All" },
    { text: "Sent" },
    { text: "Failed" },
    { text: "Scheduled" },
  ];

  return (
    <>
      <MessagesHeader title={t("home", "Home")} />

      <div className={styles.tableContainer}>
        <div>
          <Dropdown
            titleText="Filter by period: "
            initialSelectedItem={periodFilterItems[0]}
            items={periodFilterItems}
            itemToString={(item) => (item ? item.text : "")}
            type="inline"
            sentTimestamp
            className={styles.filter}
          />

          <Dropdown
            titleText="Filter by status: "
            initialSelectedItem={statusFilterItems[0]}
            items={statusFilterItems}
            itemToString={(item) => (item ? item.text : "")}
            type="inline"
            className={styles.filter}
            autoAlign={true}
          />
        </div>
        <div className={styles.header}>
          <div>
            <Layer className={styles.messagesDashboard}>
              <Tabs>
                <TabList contained>
                  <Tab>Appointment Reminders</Tab>
                  <Tab>LLM Messages</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <AppointmentMessage />
                  </TabPanel>
                  <TabPanel>
                    <LlmDataTable />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Layer>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesDashboard;
