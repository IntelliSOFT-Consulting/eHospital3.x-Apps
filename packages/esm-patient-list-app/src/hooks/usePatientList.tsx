import { useEffect, useState } from "react";
import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";

export function usePatientList() {
  const fetcher = async (url: string) => {
    const response = await openmrsFetch(url);
    return response.json();
  };

  const { data, error } = useSWR(`/ws/fhir2/R4/Patient?_count=1000`, fetcher);

  return {
    patient: data,
    isLoading: !error && !data,
    isError: error,
  };
}
