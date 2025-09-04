import useSWR from "swr";
import { type OpenmrsResource, openmrsFetch } from "@openmrs/esm-framework";
import { apiBasePath } from "../constants";

export const usePaymentMethods = () => {
  const url = `${apiBasePath}paymentMode`;
  const { data, isLoading, error } = useSWR<{
    data: { results: Array<OpenmrsResource> };
  }>(url, openmrsFetch);

  return { isLoading, error, paymentModes: data?.data?.results ?? [] };
};

export const createPatientBill = (payload) => {
  const postUrl = `${apiBasePath}bill`;
  return openmrsFetch(postUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });
};

export const useCashPoint = () => {
  const url = `${apiBasePath}cashPoint`;
  const { data, isLoading, error } = useSWR<{
    data: { results: Array<OpenmrsResource> };
  }>(url, openmrsFetch);

  return { isLoading, error, cashPoints: data?.data?.results ?? [] };
};
