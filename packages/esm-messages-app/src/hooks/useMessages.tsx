import { openmrsFetch } from '@openmrs/esm-framework';
import React, { useEffect, useState } from 'react';
import { truncateMessage } from '../helpers/truncate-message';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await openmrsFetch(
          '/ws/rest/v1/ehospital/scheduled-messages'
        );

        if (response.data) {
          const formattedMessages = response.data.map((msg: any) => ({
            id: msg.id.toString(), 
						patientUuid: msg.patientUuid,
            date: msg.scheduledDate,
            phoneNo: msg.phoneNumber,
						fullMessage: msg.message,
            message: truncateMessage(msg.message, 3),
            status: msg.status, 
						sentTimestamp: msg.sentTimestamp
          }));

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return messages;
};

export const sendPatientMessage = async (patientUuid: string) => {
	const url = `/ws/rest/v1/ehospital/sendAppointmentReminder?patientUuid=${patientUuid}`
	try {
		const response = await openmrsFetch(url, {
			method: 'POST'
		})

		if (!response.ok) {
      throw new Error(`Failed to resend message. Status: ${response.status}`);
    }
	} catch (error) {
		console.error('Error sending message:', error);
	}
}

export const resendAllMessages = async () => {
	const url = `/ws/rest/v1/ehospital/smsAppointmentReminder`
	try {
		const response = await openmrsFetch(url, {
			method: 'POST'
		})

		if (!response.ok) {
			throw new Error(`Failed to resend message. Status: ${response.status}`);
		}
	} catch (error) {
		console.error('Error sending message:', error);
	}
}