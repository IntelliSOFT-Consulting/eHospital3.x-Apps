import { openmrsFetch } from '@openmrs/esm-framework';
import React, { useEffect, useState } from 'react';

interface Observation {
  gender: string;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  diagnosis: string;
  tests: any[];
  medications: any[];
  condition: any[];
}

interface LlmResponse {
  message: string;
}

export const useObservations = (patientUuid?: string) => {
  const [data, setData] = useState<Observation[] | null>(null);
  const [llmResponse, setLLMResponse] = useState<string | null>(null);
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!patientUuid) return;

    const fetchData = async () => {
      try {
        const response = await openmrsFetch(
          `/ws/rest/v1/ehospital/patient/encounter?patientUuid=${patientUuid}`
        );

        if (response?.data) {
          const obs = response.data;
          const formatted = [
            {
              gender: obs.gender,
              age: obs.age,
              weight: obs.weight,
              height: obs.height,
              bmi: obs.bmi,
              bloodPressure: obs.blood_pressure,
              heartRate: obs.heart_rate,
              temperature: obs.temperature,
              diagnosis: obs.diagnosis,
              tests: obs.tests,
              medications: obs.medications,
              condition: obs.condition,
            },
          ];
          setData(formatted);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [patientUuid]);

  const fetchLatestMessage = async (): Promise<string | null> => {
    try {
      const response = await openmrsFetch(
        `/ws/rest/v1/ehospital/messages/patient?patientUuid=${patientUuid}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch latest message.");
      }
  
      const messages = await response.json();
      if (messages.length > 0) {
        const latest = messages[messages.length - 1].message;
        setLatestMessage(latest);
        return latest;
      }
      return null;
    } catch (error) {
      console.error("Error fetching latest message:", error);
      return null;
    }
  };

  const saveMessage = async (
      message: string,
      isEdited: boolean,
      editReason: string,
      isRegenerated: boolean,
      regenerateReason: string,
      navigateToWorkspace: () => void
  ) => {
      setIsSaving(true);
      const payload = {
          message,
          edited: isEdited ? "YES" : "NO",
          reasonEdited: isEdited ? editReason : "",
          regenerated: isRegenerated ? "YES" : "NO",
          reasonRegenerated: isRegenerated ? regenerateReason : "",
      };

      try {
          const response = await openmrsFetch(
              `/ws/rest/v1/ehospital/message/save?patientUuid=${patientUuid}`,
              {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
              }
          );

          if (!response.ok) {
              throw new Error("Failed to save message.");
          }

          navigateToWorkspace();
          await fetchLatestMessage();
      } catch (error) {
          console.error("Error saving message:", error);
      } finally {
          setIsSaving(false);
      }
  };
  
  const sendMessageViaSMS = async (message: string) => {
    setIsSending(true);
    try {
      const response = await openmrsFetch(
        `/ws/rest/v1/ehospital/message/send?patientUuid=${patientUuid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send SMS.");
      }

    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Failed to send SMS.");
    } finally {
      setIsSending(false);
    }
  };

  const generateLlmMessage = async () => {
      if (!data || data.length === 0) {
        console.warn('No observation data available for LLM.');
        throw new Error("No observation data available.");
      }

      try {
        setIsGenerating(true);
        setLLMResponse(null);

        const obs = data[0];

        const payload = {
          age: obs.age,
          gender: obs.gender,
          weight: obs.weight,
          height: obs.height,
          heart_rate: obs.heartRate,
          temperature: obs.temperature,
          blood_pressure: obs.bloodPressure,
          diagnosis: obs.diagnosis,
          tests: obs.tests?.map(test => ({
            name: test.name,
            results: test.results?.map(result => ({
              parameter: result.parameter,
              value: result.value
            }))
          })),
          medications: obs.medications,
        };

        const response = await fetch('http://localhost:5000/generate_summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`LLM request failed with status: ${response.status}`);
        }

        const responseBody: LlmResponse = await response.json();
        setLLMResponse(responseBody.message);
      } catch (err) {
        console.error("Error fetching LLM response:", err);
        throw new Error("Failed to generate LLM message. Please try again.");
      } finally {
        setIsGenerating(false);
      }
  };

  return {
    data,
    llmResponse,
    latestMessage,
    isGenerating,
    isSaving,
    isSending,
    generateLlmMessage,
    saveMessage,
    sendMessageViaSMS,
    fetchLatestMessage,
  };
};