import { openmrsFetch } from "@openmrs/esm-framework";
import React, { useState, useEffect } from "react";
import { truncateMessage } from "../helpers/truncate-message";
import dayjs from "dayjs";

export const useLLMMessages = () => {
  const [llmMessages, setLLMMessage] = useState([]);

  useEffect(() => {
    const fetchAllMessages = async (
      startDate: Date = dayjs().startOf("day").toDate(),
      endDate: Date = dayjs().endOf("day").toDate()
    ) => {
      try {
        const startDateISO = startDate.toISOString();
        const endDateISO = endDate.toISOString();

        const response = await openmrsFetch(
          `/ws/rest/v1/ehospital/messages/all?startDate=2025-03-10&endDate=2025-03-14`
        );

        if (response.data) {
          const formattedMessages = response.data.map((msg: any) => ({
            id: msg.patientUuid,
            name: msg.patientName,
            date: msg.createdAt,
            fullMessage: msg.message,
            message: truncateMessage(msg.message, 3),
            status: msg.status,
            statusMessage: msg.successOrErrorMessage,
            timeSent: msg.sentAt,
          }));

          setLLMMessage(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchAllMessages();
  }, []);
  return llmMessages;
};
