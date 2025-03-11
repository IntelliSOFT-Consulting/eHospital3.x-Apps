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
  medication: any[];
  condition: any[];
}

interface LlmResponse {
  message: string;
}

export const useObservations = (patientUuid?: string) => {
  const [data, setData] = useState<Observation[] | null>(null);
	const [llmResponse, setLLMResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!patientUuid) {
      return;
    }

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
              medication: obs.medication,
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

	const generateLlmMessage = async () => {
		if (!data || data.length === 0) {
      console.warn('No observation data available for LLM.');
      return;
    }

    try {
      setIsGenerating(true);
      setLLMResponse(null);

      const obs = data[0];

      const payload = {
        patient_data: {
          age: obs.age,
          gender: obs.gender,
          blood_pressure: obs.bloodPressure,
          heart_rate: obs.heartRate,
          temperature: obs.temperature,
          diagnosis: obs.diagnosis,
          tests: obs.tests,
          medications: obs.medication,
        },
      };

      const response = await openmrsFetch('http://sjhc.intellisoftkenya.com:5000/generate_summary', {
        method: 'POST',
        headers: { 
					'Content-Type': 'application/json' 
				},
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('LLM request failed.');
      }

      const responseBody: LlmResponse = await response.json();
      setLLMResponse(responseBody.message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
	}

  return {
		data,
		llmResponse,
		isGenerating,
		generateLlmMessage
	}
};
