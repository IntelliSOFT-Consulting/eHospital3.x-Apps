import { openmrsFetch } from "@openmrs/esm-framework";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

export const useLLMMessages = (startDate?: Date, endDate?: Date) => {
  const [llmMessages, setLLMMessage] = useState([]);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const startDateISO = (
          startDate ?? dayjs().startOf("day").toDate()
        ).toISOString();
        const endDateISO = (
          endDate ?? dayjs().endOf("day").toDate()
        ).toISOString();

        const response = await openmrsFetch(
          `/ws/rest/v1/ehospital/messages/all?startDate=${startDateISO}&endDate=${endDateISO}`
        );

        if (response.data) {
          const formattedMessages = response.data.map((msg: any) => ({
            id: msg.patientUuid,
            name: msg.patientName,
            date: msg.createdAt,
            fullMessage: msg.message,
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
  }, [startDate, endDate]);
  return { messages: llmMessages };
};

export const resendMessage = async (patientUuid: string) => {
  const url = `/ws/rest/v1/ehospital/message/send?patientUuid=${patientUuid}`;

  try {
    const response = await openmrsFetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to resend message. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
