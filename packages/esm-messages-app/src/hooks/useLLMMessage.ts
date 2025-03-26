import { openmrsFetch } from "@openmrs/esm-framework";
import useSWR from "swr";
import dayjs from "dayjs";

interface LLMMessage {
  patientUuid: string;
  patientName: string;
  createdAt: string;
  message: string;
  status: string;
  successOrErrorMessage: string;
  sentAt: string;
}

interface FormattedMessage {
  id: string;
  name: string;
  date: string;
  fullMessage: string;
  status: string;
  statusMessage: string;
  timeSent: string;
}

export const useLLMMessages = (
  startDate: Date = dayjs().startOf("day").toDate(),
  endDate: Date = dayjs().endOf("day").toDate()
) => {
  const startDateISO = dayjs(startDate).toISOString();
  const endDateISO = dayjs(endDate).toISOString();

  const url = `/ws/rest/v1/ehospital/messages/all?startDate=${startDateISO}&endDate=${endDateISO}`;

  // const url = `/ws/rest/v1/ehospital/messages/all?startDate=2025-03-10&endDate=2025-03-14`;

  const { data, error, isLoading, mutate } = useSWR<{ data: LLMMessage[] }>(
    url,
    openmrsFetch,
    { errorRetryCount: 2 }
  );

  const formattedMessages = (data?.data ?? []).map(
    (msg): FormattedMessage => ({
      id: msg.patientUuid,
      name: msg.patientName,
      date: msg.createdAt,
      fullMessage: msg.message,
      status: msg.status,
      statusMessage: msg.successOrErrorMessage,
      timeSent: msg.sentAt,
    })
  );

  return {
    messages: formattedMessages,
    error,
    isLoading,
    mutate,
  };
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
