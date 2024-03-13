import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";
import { ResponseData } from "../types";

export function usePatientEncounters(patientUuid: string) {
  const customRep = `&v=custom:(uuid,form:(uuid,encounterType:(uuid)),encounterDatetime,visit:(visitType:(display),startDatetime,stopDatetime,location:(uuid,display)))`;
  const url = `/ws/rest/v1/encounter?patient=${patientUuid}${customRep}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: ResponseData },
    Error
  >(url, openmrsFetch);
  return {
    encounters: data ? data?.data?.results?.filter((enc) => enc.visit) : [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
