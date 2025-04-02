import { openmrsFetch } from "@openmrs/esm-framework";
import useSWR from "swr";
import { truncateMessage } from "../helpers/truncate-message";

interface LLMMessage {
  id: string;
  patientUuid: string;
  sentTimestamp: string;
  message: string;
  status: string;
  phoneNumber: string;
  scheduledDate: string;
}

interface FormattedMessage {
  id: string;
  patientUuid: string;
  phoneNo: string;
  date: string;
  timeSent: string;
  message: string;
  fullMessage: string;
  status: string;
  scheduledDate: string;
}

export const useMessages = () => {
  const url = `/ws/rest/v1/ehospital/scheduled-messages`;

  const { data, error, isLoading, mutate } = useSWR<{ data: LLMMessage[] }>(
    url,
    openmrsFetch,
    { errorRetryCount: 2 }
  );

  const formattedMessages = (data?.data ?? []).map(
    (msg): FormattedMessage => ({
      id: msg.id,
      patientUuid: msg.patientUuid,
      fullMessage: msg.message,
      message: truncateMessage(msg.message, 3),
      status: msg.status,
      scheduledDate: msg.scheduledDate,
      date: msg.sentTimestamp.split(" ")[0],
      timeSent: msg.sentTimestamp,
      phoneNo: msg.phoneNumber,
    })
  );

  return {
    messages: formattedMessages,
    error,
    isLoading,
    mutate,
  };
};

export const sendPatientMessage = async (patientUuid: string) => {
  const url = `/ws/rest/v1/ehospital/sendAppointmentReminder?patientUuid=${patientUuid}`;
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

export const resendAllMessages = async () => {
  const url = `/ws/rest/v1/ehospital/smsAppointmentReminder`;
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
