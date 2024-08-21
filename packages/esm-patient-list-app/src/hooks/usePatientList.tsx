import React, {useEffect, useState} from "react";
import {openmrsFetch} from "@openmrs/esm-framework";
import {getPaddedDateString} from "../helpers/dateOps";

export function usePatientList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [currentPaginationState, setCurrentPaginationState] = useState({
    size: 50,
    page: 0
  });
  const [dateRange, setDateRange] = React.useState({
    start: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
    end: `${new Date().getDate() + 1}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
  });
  const [totalPatients, setTotalPatients] = useState(0);

  const getAllClients = async () => {
    try {
      let startString = dateRange.start;
      let endString = dateRange.end;
  
      if (typeof dateRange.start === "object") {
        const dateObject = new Date(dateRange.start);
        startString = getPaddedDateString(dateObject);
      }
  
      if (typeof dateRange.end === "object") {
        const dateObject = new Date(dateRange.end);
        endString = getPaddedDateString(dateObject);
      }
  
      let currentPage = 0;
      let allData = [];
      let hasMoreData = true;
      let totalFetchedPatients = 0;
  
      setLoading(true);
  
      const firstBatchUrl = `/ws/rest/v1/ehospital/allClients?startDate=${startString}&endDate=${endString}&page=0&size=50`;
      const firstBatchResponse = await openmrsFetch(firstBatchUrl);
  
      const firstBatchData = firstBatchResponse.data.results.map(result => ({
        ...result,
        fullName: result?.name,
        age: result?.age,
        gender: result?.sex,
        openmrsID: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("openmrs"))?.identifier,
        opdNumber: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("opd"))?.identifier,
      }));
  
      setData(firstBatchData);
      totalFetchedPatients += firstBatchData.length;
      if (firstBatchData.length < 50) {
        setTotalPatients(firstBatchResponse.data.totalPatients);
      }
      setLoading(false);
  
      if (firstBatchData.length === 50) {
        setBackgroundLoading(true);
        currentPage += 1;
  
        while (hasMoreData) {
          const url = `/ws/rest/v1/ehospital/allClients?startDate=${startString}&endDate=${endString}&page=${currentPage}&size=50`;
          const response = await openmrsFetch(url);
  
          const fetchedData = response.data.results.map(result => ({
            ...result,
            fullName: result?.name,
            age: result?.age,
            gender: result?.sex,
            openmrsID: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("openmrs"))?.identifier,
            opdNumber: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("opd"))?.identifier,
          }));
  
          allData = [...allData, ...fetchedData];
          totalFetchedPatients += fetchedData.length;
          setData(prevData => [...prevData, ...fetchedData]);
          currentPage += 1;
  
          if (fetchedData.length < 50) {
            hasMoreData = false;
          }
        }
  
        setTotalPatients(totalFetchedPatients);
        setBackgroundLoading(false);
      }
  
    } catch (e) {
      console.error(e);
      setLoading(false);
      setBackgroundLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPaginationState(prev => ({...prev, page: 0}))
    getAllClients();
  }, [dateRange]);


  return {
    data,
    patient: data,
    isLoading: loading,
    backgroundLoading,
    dateRange,
    setDateRange,
    getAllClients,
    currentPaginationState,
    totalPatients,
  };
}
