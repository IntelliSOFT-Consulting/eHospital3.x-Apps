import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabList, Tab, TabPanels, TabPanel, Layer } from "@carbon/react";
import styles from "./messages-dashboard.scss";
import MessagesHeader from "../messages-header/messages-header.component";
import LlmDataTable from "../components/llm-message-dashboard/llm-messages-table.component";
import AppointmentMessage from "../components/appointment-message-dashboard/appointment-message-table.component";
import { DateRangePicker } from "../components/filters/date-range-filter";
import { DateFilterProvider } from "../components/filters/useFilterContext";

const MessagesDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MessagesHeader title={t("home", "Home")} />

      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div>
            <DateFilterProvider>
              <DateRangePicker />
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
            </DateFilterProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesDashboard;
